import pytest
from app import create_app
from app.extensions import db as _db


@pytest.fixture(scope="function")
def app():
    app = create_app(db_uri='sqlite:///test_db.sqlite')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    with app.app_context():
        _db.create_all()
        yield app
        _db.session.remove()
        _db.drop_all()


@pytest.fixture(scope="function")
def client(app):
    with app.test_client() as client:
        with app.app_context():
            yield client
            _db.session.rollback()

@pytest.fixture(scope="function")
def runner(app):
    return app.test_cli_runner()
