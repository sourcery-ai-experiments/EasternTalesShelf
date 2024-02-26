from datetime import datetime
from sqlalchemy import create_engine, exc
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import Config
from app.functions import class_mangalist

Base = declarative_base()
MangaList = class_mangalist.MangaList



def get_manga_list_alchemy(config, testing=False):
    # Initialize the database engine
    # The connection string will depend on your database
    # For MariaDB/MySQL, it looks like this: 'mysql+pymysql://user:password@host/dbname'
    SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{Config.user_name}:{Config.db_password}@{Config.host_name}/{Config.db_name}"

    engine = create_engine(SQLALCHEMY_DATABASE_URI)
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        if testing:
            manga_list_query = session.query(MangaList).filter(MangaList.table_name == 'manga_list2')
        else:
            manga_list_query = session.query(MangaList).order_by(MangaList.last_updated_on_site.desc())

        manga_list = manga_list_query.all()

        # Convert to a list of dictionaries (if needed) and handle None values in dates
        def parse_timestamp(manga):
            manga_dict = {column.name: getattr(manga, column.name) for column in manga.__table__.columns}
            manga_dict['last_updated_on_site'] = manga_dict.get('last_updated_on_site', datetime(1900, 1, 1))
            return manga_dict

        manga_list = [parse_timestamp(manga) for manga in manga_list]

        return manga_list

    except Exception as e:
        print("Error while fetching from the database", e)
        return []
    finally:
        session.close()


def add_bato_link(id_anilist, bato_link):
    SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{Config.user_name}:{Config.db_password}@{Config.host_name}/{Config.db_name}"
    engine = create_engine(SQLALCHEMY_DATABASE_URI)
    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        # First, check if the column exists and add it if not (this may need to be handled manually or via Alembic migrations)
        
        
        if manga_entry:=session.query(MangaList).filter_by(id_anilist=id_anilist).first():
            manga_entry.bato_link = bato_link
            session.commit()
        else:
            print("Manga entry not found for AniList ID:", id_anilist)
    except exc.SQLAlchemyError as e:
        print("Error updating 'bato_link':", e)
    finally:
        session.close()