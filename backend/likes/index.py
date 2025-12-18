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
    API для работы с лайками и избранным
    GET /likes?user_id=X - получить лайки пользователя
    POST /likes - поставить/убрать лайк или добавить в избранное
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
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
            
            if not user_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing user_id'}),
                    'isBase64Encoded': False
                }
            
            cur.execute('''
                SELECT 
                    l.to_user_id,
                    l.is_favorite,
                    l.created_at,
                    u.name,
                    u.avatar_url,
                    p.life_path,
                    p.destiny
                FROM likes l
                JOIN users u ON l.to_user_id = u.id
                LEFT JOIN profiles p ON p.user_id = u.id
                WHERE l.from_user_id = %s
                ORDER BY l.created_at DESC
            ''', (user_id,))
            likes = cur.fetchall()
            
            result = [dict(like) for like in likes]
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(result, default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            from_user_id = body.get('from_user_id')
            to_user_id = body.get('to_user_id')
            is_favorite = body.get('is_favorite', False)
            action = body.get('action', 'add')
            
            if not from_user_id or not to_user_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing from_user_id or to_user_id'}),
                    'isBase64Encoded': False
                }
            
            if action == 'remove':
                cur.execute('''
                    UPDATE likes 
                    SET is_favorite = false
                    WHERE from_user_id = %s AND to_user_id = %s
                ''', (from_user_id, to_user_id))
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'action': 'removed'}),
                    'isBase64Encoded': False
                }
            
            else:
                cur.execute('''
                    INSERT INTO likes (from_user_id, to_user_id, is_favorite)
                    VALUES (%s, %s, %s)
                    ON CONFLICT (from_user_id, to_user_id)
                    DO UPDATE SET is_favorite = EXCLUDED.is_favorite
                    RETURNING id
                ''', (from_user_id, to_user_id, is_favorite))
                
                like_id = cur.fetchone()['id']
                conn.commit()
                
                cur.execute('''
                    SELECT COUNT(*) as count FROM likes 
                    WHERE from_user_id = %s AND to_user_id = %s
                    AND to_user_id IN (SELECT from_user_id FROM likes WHERE to_user_id = %s)
                ''', (from_user_id, to_user_id, from_user_id))
                
                is_match = cur.fetchone()['count'] > 0
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'like_id': like_id,
                        'is_match': is_match
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
