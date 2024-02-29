import os
from vault_approle_functions import vault_login, read_secret


anilist_id = 444059
is_development = os.environ.get('FLASK_ENV') # 'development' or 'production'
table_name = 'manga_list_development' if is_development == 'development' else 'manga_list'
host_name_secret = 'db_host_name_vps_contener' if is_development == 'production' else 'db_host_name'

print(f"Setting enviroment to: {is_development}, table name: {table_name}, host_name_secret: {host_name_secret}")

def refresh_credentials():
    VAULT_ADDR = os.environ.get('VAULT_ADDR')  # Default to localhost if not set
    ROLE_ID = os.environ.get('VAULT_ROLE_ID_shiro_chan_project')
    SECRET_ID = os.environ.get('VAULT_SECRET_ID_shiro_chan_project')

    secret_path = "secret/data/shiro_chan_project"  # Replace with your actual secret path

    # Main usage
    try:
        client_token = vault_login(VAULT_ADDR, ROLE_ID, SECRET_ID)
        secret = read_secret(VAULT_ADDR, client_token, secret_path)
        
        user_name = secret['db_user_name']
        db_password = secret['db_password']
        host_name = secret[host_name_secret]
        db_name = secret['anilist_db_name']

        print("VARIABLES SET FROM VAULT")
    except Exception as e:
        print("COULDN'T SET VARIABLES FROM VAULT, ERROR: ")
        print(e)
    return host_name, db_name, user_name, db_password
