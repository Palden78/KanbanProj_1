from pwdlib import PasswordHash

password_hash_contet = PasswordHash.recommended()

def hash_password(password:str)-> str :
    return password_hash_contet.hash(password)

def verify_password(plain_password:str, hashed_password:str)-> bool:
    return password_hash_contet.verify(plain_password, hashed_password)