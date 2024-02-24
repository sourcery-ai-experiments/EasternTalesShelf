from unittest import mock
from app.functions.sqlalchemy_fns import get_manga_list_alchemy
from sqlalchemy import Column, Integer, String, Float, TIMESTAMP, Text, Boolean
# Assuming MockMangafrom datetime import datetime

from sqlalchemy import create_engine, Column, Integer, String, DateTime, Float, TIMESTAMP, Text, exc
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker


Base = declarative_base()

class MockManga(Base):
    __tablename__ = 'manga_list'
    id_default = Column(Integer, primary_key=True, autoincrement=True)
    id_anilist = Column(Integer, nullable=False)
    id_mal = Column(Integer)
    title_english = Column(String(255))
    title_romaji = Column(String(255))
    on_list_status = Column(String(255))
    status = Column(String(255))
    media_format = Column(String(255))
    all_chapters = Column(Integer, default=0)
    all_volumes = Column(Integer, default=0)
    chapters_progress = Column(Integer, default=0)
    volumes_progress = Column(Integer, default=0)
    score = Column(Float, default=0)
    reread_times = Column(Integer, default=0)
    cover_image = Column(String(255))
    is_cover_downloaded = Column(Boolean, default=False)
    is_favourite = Column(Integer, default=0)
    anilist_url = Column(String(255))
    mal_url = Column(String(255))
    last_updated_on_site = Column(TIMESTAMP)
    entry_createdAt = Column(TIMESTAMP)
    user_startedAt = Column(Text, default='not started')
    user_completedAt = Column(Text, default='not completed')
    notes = Column(Text)
    description = Column(Text)
    country_of_origin = Column(String(255))
    media_start_date = Column(Text, default='media not started')
    media_end_date = Column(Text, default='media not ended')
    genres = Column(Text, default='none genres provided')
    external_links = Column(Text, default='none links associated')
    bato_link = Column(Text, default='')  # Adjust types and column names as necessary

@mock.patch('app.functions.sqlalchemy_fns.get_session')
def test_get_manga_list_alchemy_mock(mock_get_session):
    mock_session = mock.Mock()
    mock_get_session.return_value = mock_session

    mock_manga_list = [
        MockManga(id_default=1, title_english="Mock Manga", last_updated_on_site="2020-01-01")
    ]
    mock_session.query.return_value.order_by.return_value.all.return_value = mock_manga_list

    result = get_manga_list_alchemy()

    assert len(result) == 1
    assert result[0]['title_english'] == "Mock Manga"
