import requests

# Authenticate using AppRole
def vault_login(vault_addr, role_id, secret_id):
    url = f"{vault_addr}/v1/auth/approle/login"
    data = {"role_id": role_id, "secret_id": secret_id}
    response = requests.post(url, json=data)
    if response.status_code == 200:
        # The client token is nested under 'auth' -> 'client_token'
        return response.json()["auth"]["client_token"]
    else:
        raise Exception(f"Error logging in to Vault: {response.status_code}")

# Read a secret from Vault
def read_secret(vault_addr, vault_token, path):
    url = f"{vault_addr}/v1/{path}"
    headers = {"X-Vault-Token": vault_token}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        # The actual secret data is nested under 'data' -> 'data'
        return response.json()["data"]['data']
    else:
        raise Exception(f"Error reading secret: {response.status_code}")

