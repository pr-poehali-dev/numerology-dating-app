import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime, date

def get_db():
    '''Получить подключение к базе данных'''
    return psycopg2.connect(os.environ['DATABASE_URL'])

def calculate_life_path(birth_date: str) -> int:
    '''Рассчитать число жизненного пути из даты рождения'''
    digits = birth_date.replace('-', '')
    total = sum(int(d) for d in digits)
    while total > 9 and total not in [11, 22, 33]:
        total = sum(int(d) for d in str(total))
    return total

def calculate_destiny(name: str) -> int:
    '''Рассчитать число судьбы из имени'''
    values = {
        'а': 1, 'б': 2, 'в': 3, 'г': 4, 'д': 5, 'е': 6, 'ё': 6, 'ж': 7, 'з': 8, 'и': 9,
        'й': 1, 'к': 2, 'л': 3, 'м': 4, 'н': 5, 'о': 6, 'п': 7, 'р': 8, 'с': 9,
        'т': 1, 'у': 2, 'ф': 3, 'х': 4, 'ц': 5, 'ч': 6, 'ш': 7, 'щ': 8, 'ы': 9,
        'э': 1, 'ю': 2, 'я': 3,
        'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 8, 'i': 9,
        'j': 1, 'k': 2, 'l': 3, 'm': 4, 'n': 5, 'o': 6, 'p': 7, 'q': 8, 'r': 9,
        's': 1, 't': 2, 'u': 3, 'v': 4, 'w': 5, 'x': 6, 'y': 7, 'z': 8
    }
    total = sum(values.get(char.lower(), 0) for char in name)
    while total > 9 and total not in [11, 22, 33]:
        total = sum(int(d) for d in str(total))
    return total

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    API для работы с профилями пользователей
    GET /profiles - список всех видимых профилей
    GET /profiles/{id} - получить профиль по ID
    POST /profiles - создать/обновить профиль
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
            profile_id = params.get('id')
            
            if profile_id:
                cur.execute('''
                    SELECT 
                        p.*, 
                        u.name, 
                        u.email, 
                        u.avatar_url,
                        EXTRACT(YEAR FROM AGE(p.birth_date)) AS age
                    FROM profiles p
                    JOIN users u ON p.user_id = u.id
                    WHERE p.id = %s AND p.is_visible = true
                ''', (profile_id,))
                profile = cur.fetchone()
                
                if not profile:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Profile not found'}),
                        'isBase64Encoded': False
                    }
                
                result = dict(profile)
                if result.get('birth_date'):
                    result['birth_date'] = result['birth_date'].isoformat()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(result, default=str),
                    'isBase64Encoded': False
                }
            
            else:
                cur.execute('''
                    SELECT 
                        p.*, 
                        u.name, 
                        u.email, 
                        u.avatar_url,
                        EXTRACT(YEAR FROM AGE(p.birth_date)) AS age
                    FROM profiles p
                    JOIN users u ON p.user_id = u.id
                    WHERE p.is_visible = true
                    ORDER BY p.created_at DESC
                    LIMIT 50
                ''')
                profiles = cur.fetchall()
                
                result = []
                for profile in profiles:
                    p = dict(profile)
                    if p.get('birth_date'):
                        p['birth_date'] = p['birth_date'].isoformat()
                    result.append(p)
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(result, default=str),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            
            user_data = body.get('user', {})
            profile_data = body.get('profile', {})
            
            cur.execute('''
                INSERT INTO users (email, name, provider, avatar_url)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT (email) 
                DO UPDATE SET name = EXCLUDED.name, avatar_url = EXCLUDED.avatar_url, last_active = CURRENT_TIMESTAMP
                RETURNING id
            ''', (
                user_data.get('email'),
                user_data.get('name'),
                user_data.get('provider', 'guest'),
                user_data.get('avatar_url')
            ))
            user_id = cur.fetchone()['id']
            
            birth_date = profile_data.get('birth_date')
            if birth_date:
                life_path = calculate_life_path(birth_date)
                destiny = calculate_destiny(user_data.get('name', ''))
                
                cur.execute('''
                    INSERT INTO profiles (
                        user_id, birth_date, gender, city, bio, interests, 
                        life_path, destiny, latitude, longitude, photo_urls
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (user_id)
                    DO UPDATE SET 
                        birth_date = EXCLUDED.birth_date,
                        gender = EXCLUDED.gender,
                        city = EXCLUDED.city,
                        bio = EXCLUDED.bio,
                        interests = EXCLUDED.interests,
                        life_path = EXCLUDED.life_path,
                        destiny = EXCLUDED.destiny,
                        latitude = EXCLUDED.latitude,
                        longitude = EXCLUDED.longitude,
                        photo_urls = EXCLUDED.photo_urls,
                        updated_at = CURRENT_TIMESTAMP
                    RETURNING id
                ''', (
                    user_id,
                    birth_date,
                    profile_data.get('gender'),
                    profile_data.get('city'),
                    profile_data.get('bio'),
                    profile_data.get('interests', []),
                    life_path,
                    destiny,
                    profile_data.get('latitude'),
                    profile_data.get('longitude'),
                    profile_data.get('photo_urls', [])
                ))
                
                profile_id = cur.fetchone()['id']
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'user_id': user_id,
                        'profile_id': profile_id,
                        'life_path': life_path,
                        'destiny': destiny
                    }),
                    'isBase64Encoded': False
                }
            
            else:
                conn.commit()
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'user_id': user_id}),
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
