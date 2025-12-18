import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db():
    '''Получить подключение к базе данных'''
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    API для работы с чатами и сообщениями
    GET /chat?user_id=X - получить все чаты пользователя
    GET /chat?chat_id=X - получить сообщения чата
    POST /chat - отправить сообщение или создать чат
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = get_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            user_id = params.get('user_id')
            chat_id = params.get('chat_id')
            
            if chat_id:
                cur.execute('''
                    SELECT m.*, u.name as sender_name, u.avatar_url as sender_avatar
                    FROM messages m
                    JOIN users u ON m.sender_id = u.id
                    WHERE m.chat_id = %s
                    ORDER BY m.created_at ASC
                ''', (chat_id,))
                messages = cur.fetchall()
                
                result = [dict(msg) for msg in messages]
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(result, default=str),
                    'isBase64Encoded': False
                }
            
            elif user_id:
                cur.execute('''
                    SELECT 
                        c.id as chat_id,
                        c.user1_id,
                        c.user2_id,
                        u.name as partner_name,
                        u.avatar_url as partner_avatar,
                        (SELECT content FROM messages WHERE chat_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message,
                        (SELECT created_at FROM messages WHERE chat_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message_time,
                        (SELECT COUNT(*) FROM messages WHERE chat_id = c.id AND sender_id != %s AND is_read = false) as unread_count
                    FROM chats c
                    JOIN users u ON (CASE WHEN c.user1_id = %s THEN c.user2_id ELSE c.user1_id END) = u.id
                    WHERE c.user1_id = %s OR c.user2_id = %s
                    ORDER BY last_message_time DESC NULLS LAST
                ''', (user_id, user_id, user_id, user_id))
                chats = cur.fetchall()
                
                result = [dict(chat) for chat in chats]
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(result, default=str),
                    'isBase64Encoded': False
                }
            
            else:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing user_id or chat_id'}),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            sender_id = body.get('sender_id')
            recipient_id = body.get('recipient_id')
            content = body.get('content')
            chat_id = body.get('chat_id')
            
            if not sender_id or not content:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing sender_id or content'}),
                    'isBase64Encoded': False
                }
            
            if not chat_id:
                if not recipient_id:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Missing recipient_id for new chat'}),
                        'isBase64Encoded': False
                    }
                
                user1 = min(int(sender_id), int(recipient_id))
                user2 = max(int(sender_id), int(recipient_id))
                
                cur.execute('''
                    INSERT INTO chats (user1_id, user2_id)
                    VALUES (%s, %s)
                    ON CONFLICT (user1_id, user2_id) DO UPDATE SET user1_id = EXCLUDED.user1_id
                    RETURNING id
                ''', (user1, user2))
                chat_id = cur.fetchone()['id']
            
            cur.execute('''
                INSERT INTO messages (chat_id, sender_id, content)
                VALUES (%s, %s, %s)
                RETURNING id, created_at
            ''', (chat_id, sender_id, content))
            
            message = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'chat_id': chat_id,
                    'message_id': message['id'],
                    'created_at': message['created_at'].isoformat()
                }),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
    
    finally:
        cur.close()
        conn.close()
