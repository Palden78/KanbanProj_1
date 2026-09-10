
"""
Priority: Task creation, cross user access tests
"""


# In test_ownership.py & test_cascade.py:
def test_task_creation(client, user_a_headers):
    response = client.post(
        "/tasks",
        json={"taskName": "User A Task", "description": "Private task"},
        headers=user_a_headers
    )
    assert response.status_code == 201

    res_data = response.json()
    # Handle response wrapping if present (e.g., {"data": {...}} or {"task": {...}})
    task = res_data.get("data") or res_data.get("task") or res_data

    # Check key flexibility for camelCase vs snake_case
    task_title = task.get("taskName") or task.get("task_name")
    assert task_title == "User A Task"
    assert "id" in task or "_id" in task


def test_owner_filtered_task_listing(client, user_a_headers, user_b_headers):
    # Include required fields like status/description in the JSON payload
    res_create_a = client.post(
        "/tasks", 
        json={"taskName": "A's Task", "status": "todo", "description": "Task A"}, 
        headers=user_a_headers
    )
    res_create_b = client.post(
        "/tasks", 
        json={"taskName": "B's Task", "status": "todo", "description": "Task B"}, 
        headers=user_b_headers
    )
    assert res_create_a.status_code == 201
    assert res_create_b.status_code == 201

    res_a = client.get("/tasks", headers=user_a_headers)
    assert res_a.status_code == 200

    raw_json = res_a.json()
    tasks_a = raw_json.get("data") if isinstance(raw_json, dict) and "data" in raw_json else raw_json

    assert len(tasks_a) == 1
    first_task = tasks_a[0]
    task_title = first_task.get("taskName") or first_task.get("task_name")
    assert task_title == "A's Task"


def test_cross_user_task_access_denied(client, user_a_headers, user_b_headers):
    create_res = client.post(
        "/tasks", 
        json={"taskName": "A Secret Task", "status": "todo", "description": "Secret"}, 
        headers=user_a_headers
    )
    assert create_res.status_code == 201

    res_data = create_res.json()
    task = res_data.get("data") or res_data.get("task") or res_data
    task_id = task["id"]

    access_res = client.get(f"/tasks/{task_id}", headers=user_b_headers)
    assert access_res.status_code in (403, 404)


def test_cross_user_task_access_denied(client, user_a_headers, user_b_headers):
    create_res = client.post("/tasks", json={"taskName": "A Secret Task"}, headers=user_a_headers)
    assert create_res.status_code == 201

    res_data = create_res.json()
    task = res_data.get("data") or res_data.get("task") or res_data
    task_id = task["id"]

    # Attempt cross-user access
    access_res = client.get(f"/tasks/{task_id}", headers=user_b_headers)
    assert access_res.status_code in (403, 404)

def test_cross_user_task_access_denied(client, user_a_headers, user_b_headers):
    # 1. Provide all required fields in the creation payload
    create_payload = {
        "taskName": "A Secret Task",
        "status": "todo",
        "description": "Top Secret"
    }
    
    create_res = client.post("/tasks", json=create_payload, headers=user_a_headers)
    
    # Optional debugging helper: print validation errors if 422 occurs
    if create_res.status_code == 422:
        print("Validation Error Payload:", create_res.json())
        
    assert create_res.status_code == 201

    res_data = create_res.json()
    task = res_data.get("data") or res_data.get("task") or res_data
    task_id = task["id"]

    # 2. Verify User B gets 403 Forbidden or 404 Not Found when trying to fetch User A's task
    access_res = client.get(f"/tasks/{task_id}", headers=user_b_headers)
    assert access_res.status_code in (403, 404)