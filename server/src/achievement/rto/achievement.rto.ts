/**
 * Элемент списка достижений в ответе API.
 * obtained — true, если пользователь уже получил это достижение.
 * type — тип условия (логика на клиенте/бэке по нему).
 * targetValue — целевое значение для типа (уровень, кол-во и т.д.), может быть null.
 */
export interface AchievementItemRto {
  id: number;
  title: string;
  description: string;
  type: string;
  targetValue: number | null;
  sortOrder: number;
  obtained: boolean;
}

/**
 * Ответ эндпоинта получения достижений пользователя.
 * Массив всех достижений с флагом «получено / не получено».
 */
export interface AchievementsListRto {
  achievements: AchievementItemRto[];
}
