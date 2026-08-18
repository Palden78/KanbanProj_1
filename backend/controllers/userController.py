from fastAPI import APIRouter

router = APIRouter(
    prefix = "/users",
    tags= ["users"]
)

@router.get("/")
async def getUsers():
    pass