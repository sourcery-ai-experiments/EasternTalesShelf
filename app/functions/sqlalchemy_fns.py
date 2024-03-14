from datetime import datetime
from sqlalchemy import exc
from app.functions.class_mangalist import engine, Base, MangaList, db_session, session_maker
from app.config import is_development_mode # development or production

def initialize_database():
    """Initialize the database by creating all tables."""
    Base.metadata.create_all(bind=engine)

def get_manga_list_alchemy():
    with session_maker() as session:
        try:
            manga_list = session.query(MangaList).order_by(MangaList.last_updated_on_site.desc()).all()

            if is_development_mode == 'production': # this fixes errors on VPS but causes infinite loop when I connect from pc with mariadb on VPS
                session.commit()  # Explicit commit; safe even if no changes were made

            return [parse_timestamp(manga) for manga in manga_list]
        except Exception as e:
            print("Error while fetching from the database:", e)
            session.rollback()  # Explicit rollback in case of error
            return []
        finally:
            session.close()  # Ensure session is closed properly

def parse_timestamp(manga):
    """Parse timestamps for manga entries."""
    manga_dict = {column.name: getattr(manga, column.name) for column in manga.__table__.columns}
    manga_dict['last_updated_on_site'] = manga_dict.get('last_updated_on_site', datetime(1900, 1, 1))
    return manga_dict

def update_cover_download_status_bulk(ids_to_download, status):
    """Update the download status for a bulk of manga entries."""
    try:
        db_session.query(MangaList).filter(MangaList.id_anilist.in_(ids_to_download)).update({"is_cover_downloaded": status}, synchronize_session='fetch')
        db_session.commit()
        print(f"Updated cover download status for {len(ids_to_download)} entries.")
    except Exception as e:
        db_session.rollback()
        print("Error updating cover download statuses:", e)
    finally:
        db_session.remove()

def add_bato_link(id_anilist, bato_link):
    """Add a 'bato' link to a manga entry."""
    with session_maker() as session:
        try:
            manga_entry = session.query(MangaList).filter_by(id_anilist=id_anilist).first()
            if manga_entry:
                manga_entry.bato_link = bato_link
                session.commit()
            else:
                print("Manga entry not found for AniList ID:", id_anilist)
        except exc.SQLAlchemyError as e:
            session.rollback()
            print("Error updating 'bato_link':", e)
        finally:
            session.remove()

        
initialize_database()