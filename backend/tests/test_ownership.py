"""
Task creation and cross-user access tests
"""

import pytest


pytestmark = pytest.mark.postgresql


def test_task_creation(client, user_a_headers):
    response = client.post(
        "/tasks/",
        json={"taskName": "User A Task", "description": "Private task"},
        headers=user_a_headers,
    )
    assert response.status_code == 201

    task = response.json()
    assert task["task_name"] == "User A Task"
    assert "id" in task


def test_owner_filtered_task_listing(client, user_a_headers, user_b_headers):
    res_create_a = client.post(
        "/tasks/",
        json={"taskName": "A's Task", "description": "Task A"},
        headers=user_a_headers,
    )
    res_create_b = client.post(
        "/tasks/",
        json={"taskName": "B's Task", "description": "Task B"},
        headers=user_b_headers,
    )
    assert res_create_a.status_code == 201
    assert res_create_b.status_code == 201

    res_a = client.get("/tasks/", headers=user_a_headers)
    assert res_a.status_code == 200

    tasks_a = res_a.json()
    assert len(tasks_a) == 1
    assert tasks_a[0]["task_name"] == "A's Task"


def test_cross_user_task_access_denied(client, user_a_headers, user_b_headers):
    create_res = client.post(
        "/tasks/",
        json={"taskName": "A Secret Task", "description": "Top Secret"},
        headers=user_a_headers,
    )
    assert create_res.status_code == 201

    task_id = create_res.json()["id"]
    access_res = client.get(f"/tasks/{task_id}", headers=user_b_headers)
    assert access_res.status_code in (403, 404)
