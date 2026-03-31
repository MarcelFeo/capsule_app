from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SECRET_KEY: str = "chave-ultra-super-mega-secreta-trocar-depois"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

settings = Settings()
