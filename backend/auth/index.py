import json
import os
from typing import Dict, Any
from urllib.parse import urlencode, parse_qs
import uuid
import time

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Обработка OAuth авторизации через Яндекс ID
    Аргументы: event с httpMethod, queryStringParameters
    Возвращает: HTTP ответ с редиректом или данными пользователя
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
    
    params = event.get('queryStringParameters') or {}
    action = params.get('action', 'mock')
    
    if action == 'login':
        client_id = os.environ.get('YANDEX_CLIENT_ID')
        redirect_uri = params.get('redirect_uri', 'https://your-domain.com/api/auth/callback')
        
        if not client_id:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'OAuth not configured'}),
                'isBase64Encoded': False
            }
        
        state = str(uuid.uuid4())
        query_params = urlencode({
            'response_type': 'code',
            'client_id': client_id,
            'redirect_uri': redirect_uri,
            'state': state
        })
        auth_url = f"https://oauth.yandex.ru/authorize?{query_params}"
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'url': auth_url, 'state': state}),
            'isBase64Encoded': False
        }
    
    if action == 'callback':
        code = params.get('code')
        
        if not code:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'No authorization code'}),
                'isBase64Encoded': False
            }
        
        mock_user = {
            'id': str(uuid.uuid4()),
            'name': 'Пользователь Яндекса',
            'email': 'user@yandex.ru',
            'avatar': '👤',
            'provider': 'yandex'
        }
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(mock_user),
            'isBase64Encoded': False
        }
    
    if action == 'mock':
        provider = params.get('provider', 'google')
        
        mock_users = {
            'google': {
                'id': str(uuid.uuid4()),
                'name': 'Алексей Иванов',
                'email': 'alexey@gmail.com',
                'avatar': '👨🏻',
                'provider': 'google'
            },
            'vk': {
                'id': str(uuid.uuid4()),
                'name': 'Мария Петрова',
                'email': 'maria@vk.com',
                'avatar': '👩🏻',
                'provider': 'vk'
            },
            'yandex': {
                'id': str(uuid.uuid4()),
                'name': 'Дмитрий Сидоров',
                'email': 'dmitry@ya.ru',
                'avatar': '👨🏼',
                'provider': 'yandex'
            },
            'telegram': {
                'id': str(uuid.uuid4()),
                'name': 'Анна Смирнова',
                'email': 'anna@t.me',
                'avatar': '👩🏼',
                'provider': 'telegram'
            }
        }
        
        user = mock_users.get(provider, mock_users['google'])
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(user),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 404,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Not found'}),
        'isBase64Encoded': False
    }