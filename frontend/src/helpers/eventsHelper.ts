/**
 * <p>Обновляет path, генерируя путь от документа до target-node в виде массива</p>
 * @param path текущий node
 * @param target массив node
 */
export function updateNodePath(path: Node[], target: Node) {
    if (target) {
        path.push(target)

        if (target.parentNode) {
            updateNodePath(path, target.parentNode)
        }
    }
}