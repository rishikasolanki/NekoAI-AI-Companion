from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.websocket.manager import manager

router = APIRouter(
    tags=["WebSocket"],
)


@router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
):
    """
    Real-time connection used by the frontend
    and the desktop pet.
    """

    await manager.connect(websocket)

    try:

        while True:

            message = await websocket.receive_text()

            await manager.send_message(
                f"NekoAI: {message}"
            )

    except WebSocketDisconnect:

        manager.disconnect(websocket)

    except Exception as error:

        print("WebSocket Error:", error)

        manager.disconnect(websocket)