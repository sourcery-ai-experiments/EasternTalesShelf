import os
from app.vault_approle_functions import vault_login, read_secret

class Config(object):
    # ... [other parts of your class] ...

    # Initialize Vault client and fetch secrets
    VAULT_ADDR = os.getenv('VAULT_ADDR')
    ROLE_ID = os.getenv('VAULT_ROLE_ID_shiro_chan_project')
    SECRET_ID = os.getenv('VAULT_SECRET_ID_shiro_chan_project')
    VAULT_SECRET_PATH = "secret/data/shiro_chan_project"
    
    @classmethod
    def fetch_vault_secrets(cls):
        try:
            client_token = vault_login(cls.VAULT_ADDR, cls.ROLE_ID, cls.SECRET_ID)
            secrets = read_secret(cls.VAULT_ADDR, client_token, cls.VAULT_SECRET_PATH)
            # Set the secrets as class attributes
            cls.user_name = secrets['db_user_name']
            cls.db_password = secrets['db_password']
            cls.db_name = secrets['anilist_db_name']

            if os.getenv('FLASK_ENV') == 'production':
                cls.host_name = secrets['db_host_name_vps_contener']
            else:
                cls.host_name = secrets['db_host_name']

            cls.flask_secret_key = secrets['flask_secret_key']

            print("VARIABLES SET FROM VAULT")
        except Exception as e:
            print("Couldn't set variables from Vault, error:")
            print(e)

# Outside of your class definition
Config.fetch_vault_secrets()

        
class DevelopmentConfig(Config):
    DEBUG = True
    # Development-specific configurations

class ProductionConfig(Config):
    DEBUG = False
    # Production-specific configurations

# Choose the configuration based on an environment variable
config_dict = {
    'development': DevelopmentConfig,
    'production': ProductionConfig
}

is_development_mode = config_dict[os.getenv('FLASK_ENV', 'development')]
fastapi_updater_server_IP = "eastern-updater-fastapi"
database_type = "mariadb"  #  "mariadb" or "sql_lite"

if database_type == "mariadb":
    DATABASE_URI = f"mysql+pymysql://{Config.user_name}:{Config.db_password}@{Config.host_name}/{Config.db_name}"    
elif database_type == "sql_lite":
    DATABASE_URI = 'sqlite:///anilist_db.db'

