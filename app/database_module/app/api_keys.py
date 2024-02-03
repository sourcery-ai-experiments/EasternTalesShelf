import os
from vault_approle_functions import vault_login, read_secret


anilist_id = 444059


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
        host_name = secret['db_host_name_vps_contener']
        db_name = secret['anilist_db_name']

        print("VARIABLES SET FROM VAULT")
    except Exception as e:
        print("COULDN'T SET VARIABLES FROM VAULT, ERROR: ")
        print(e)
    return host_name, db_name, user_name, db_password
