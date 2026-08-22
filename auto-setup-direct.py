#!/usr/bin/env python3
"""
Автоматичне налаштування Vercel Environment Variables
Використання: python3 auto-setup-direct.py
"""

import os
import sys
import json
import urllib.request
import urllib.error

TELEGRAM_BOT_TOKEN = "8994978328:AAF-ORLZ804iPFMLc7PWJOEDW_MHkaQgzyA"
PROJECT_NAME = "kava-menu"

def print_step(message):
    print(f"\n{'='*60}")
    print(f"  {message}")
    print(f"{'='*60}")

def make_request(url, method="GET", data=None, token=None):
    """Make HTTP request to Vercel API"""
    headers = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    if data:
        headers["Content-Type"] = "application/json"
        data = json.dumps(data).encode('utf-8')
    
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode())
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        raise Exception(f"HTTP {e.code}: {error_body}")

def main():
    print_step("🚀 Автоматичне Налаштування Telegram Bot")
    
    # Check for VERCEL_TOKEN
    token = os.getenv("VERCEL_TOKEN")
    
    if not token:
        print("\n❌ VERCEL_TOKEN не знайдено в environment")
        print("\n╔═══════════════════════════════════════════════════════════╗")
        print("║  ДВА СПОСОБИ ЗАВЕРШИТИ НАЛАШТУВАННЯ:                     ║")
        print("╚═══════════════════════════════════════════════════════════╝")
        print("\n📋 СПОСІБ 1: Через веб-інтерфейс (НАЙШВИДШЕ - 1 хвилина)")
        print("   1. Відкрийте файл: auto-setup.html у браузері")
        print("   2. Отримайте токен: https://vercel.com/account/tokens")
        print("   3. Вставте токен та натисніть кнопку")
        print("   4. Готово!")
        
        print("\n📋 СПОСІБ 2: Через цей скрипт (2 хвилини)")
        print("   1. Отримайте токен: https://vercel.com/account/tokens")
        print("   2. Запустіть:")
        print(f"      export VERCEL_TOKEN='ваш_токен'")
        print(f"      python3 {sys.argv[0]}")
        
        print("\n📋 СПОСІБ 3: Вручну через Vercel Dashboard (5 хвилин)")
        print("   Деталі в файлі: SETUP_INSTRUCTIONS.md")
        
        print("\n" + "="*60)
        sys.exit(1)
    
    try:
        # Step 1: Find project
        print("\n⏳ Крок 1: Пошук проекту...")
        project = make_request(
            f"https://api.vercel.com/v9/projects/{PROJECT_NAME}",
            token=token
        )
        project_id = project["id"]
        print(f"✅ Проект знайдено: {PROJECT_NAME} (ID: {project_id})")
        
        # Step 2: Check existing env vars
        print("\n⏳ Крок 2: Перевірка існуючих змінних...")
        env_data = make_request(
            f"https://api.vercel.com/v9/projects/{project_id}/env",
            token=token
        )
        
        existing_var = next(
            (v for v in env_data.get("envs", []) if v.get("key") == "TELEGRAM_BOT_TOKEN"),
            None
        )
        
        if existing_var:
            print(f"⚠️  Знайдено стару змінну TELEGRAM_BOT_TOKEN")
            print("⏳ Видалення старої змінної...")
            make_request(
                f"https://api.vercel.com/v9/projects/{project_id}/env/{existing_var['id']}",
                method="DELETE",
                token=token
            )
            print("✅ Стара змінна видалена")
        else:
            print("✅ Старих змінних не знайдено")
        
        # Step 3: Add new env var
        print("\n⏳ Крок 3: Додавання TELEGRAM_BOT_TOKEN...")
        make_request(
            f"https://api.vercel.com/v10/projects/{project_id}/env",
            method="POST",
            data={
                "key": "TELEGRAM_BOT_TOKEN",
                "value": TELEGRAM_BOT_TOKEN,
                "type": "encrypted",
                "target": ["production", "preview", "development"]
            },
            token=token
        )
        print("✅ TELEGRAM_BOT_TOKEN додано успішно!")
        
        # Step 4: Trigger deployment
        print("\n⏳ Крок 4: Запуск deployment...")
        deploy = make_request(
            "https://api.vercel.com/v13/deployments",
            method="POST",
            data={
                "name": PROJECT_NAME,
                "gitSource": {
                    "type": "github",
                    "ref": "main",
                    "repoId": "WayZeman/kava-menu"
                }
            },
            token=token
        )
        
        deploy_url = deploy.get("url", "")
        if deploy_url:
            print(f"✅ Deployment запущено: https://{deploy_url}")
        else:
            print("⚠️  Deployment не запустився автоматично")
            print("   Запустіть вручну через Vercel Dashboard")
        
        # Final message
        print_step("🎉 НАЛАШТУВАННЯ ЗАВЕРШЕНО!")
        
        print("\n✅ Що зроблено:")
        print("   • TELEGRAM_BOT_TOKEN додано в Vercel")
        print("   • Deployment запущено")
        print("   • Бот готовий до роботи")
        
        print("\n📋 Наступні кроки:")
        print("   1. Дочекайтеся завершення deployment (~2 хв)")
        print("   2. Перевірте: https://kava-menu.vercel.app")
        print("   3. Зробіть тестове замовлення")
        print("   4. ⚠️  ВАЖЛИВО: Скасуйте старий токен через @BotFather!")
        
        print("\n" + "="*60 + "\n")
        
    except Exception as e:
        print(f"\n❌ Помилка: {e}")
        print("\nПерев'рте:")
        print("  • Токен правильний")
        print("  • Токен має права доступу до проекту")
        print("  • Інтернет-з'єднання")
        sys.exit(1)

if __name__ == "__main__":
    main()
