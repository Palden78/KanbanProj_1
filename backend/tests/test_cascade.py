
"""
User deletion and task cascading tests
"""


import uuid

from db.orm_models import Task

def test_user_deletion_cascades_tasks(client, user_a_headers, db_session):
    # Create task for User A
    create_res = client.post("/tasks/", json={"taskName": "Cascade Task", "description":"cascade description"}, headers=user_a_headers)
    task_id = uuid.UUID(create_res.json()["id"])

    # Delete User A
    del_res = client.delete("/users/me", headers=user_a_headers)
    assert del_res.status_code in [200, 204]

    # Verify task was removed from PostgreSQL/SQLite via CASCADE
    task_in_db = db_session.query(Task).filter(Task.id == task_id).first()
    assert task_in_db is None