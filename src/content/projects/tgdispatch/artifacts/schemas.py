from enum import Enum

from pydantic import BaseModel, Field


class Priority(str, Enum):
    LOW = "низкий"
    MEDIUM = "средний"
    HIGH = "высокий"
    URGENT = "срочно"


class Category(str, Enum):
    MARKETING = "Маркетинг"
    PROCUREMENT = "Закупки"
    CONTENT = "Контент"
    TECHNICAL = "Техническое"
    LOGISTICS = "Логистика"
    GENERAL = "Общее"


class TaskSchema(BaseModel):
    """Структурированное представление задачи, извлечённое LLM из сообщения сотрудника."""

    title: str = Field(description="Краткое и понятное название задачи (до 80 символов).")
    description: str = Field(description="Подробное описание задачи из исходного сообщения.")
    deadline: str | None = Field(
        default=None,
        description=(
            "Дедлайн в формате ISO (YYYY-MM-DD или YYYY-MM-DDTHH:MM) если он однозначно "
            "вычисляется, иначе — текстовое описание дедлайна как в сообщении "
            "(например, 'завтра до 18:00'). None, если дедлайн не указан."
        ),
    )
    priority: Priority = Field(default=Priority.MEDIUM, description="Приоритет задачи.")
    assignee: str | None = Field(
        default=None, description="Имя ответственного лица, если упомянуто в тексте."
    )
    category: Category = Field(default=Category.GENERAL, description="Категория задачи.")
