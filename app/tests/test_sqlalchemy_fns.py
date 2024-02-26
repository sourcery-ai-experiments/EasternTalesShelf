from unittest import mock
from app.functions.sqlalchemy_fns import get_manga_list_alchemy
from sqlalchemy.orm import declarative_base
from app.functions.class_mangalist import MangaList as MockManga

Base = declarative_base()


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
