import {TodoItem} from "../TodoItem/TodoItem.tsx";
import styles from "./Todo.module.scss"
import {useEffect, useState} from "react";
import {clsx} from 'clsx';
import {HandleChangeLabelProps, HandleCheckboxClickProps, TodoItemStatus, TTodo} from "../../types.ts"
import {EditableLabel} from "../EditableLabel/EditableLabel.tsx";


export interface TodoProps extends TTodo {
    onDeleteTodoItem: (idTodo: number, idItem: number) => void
    onDeleteTodo: (idTodo: number) => void
    onAddTodoItem: (label: string, todoId: number) => void
    onCheckboxClick: ({idTodo, idItem, checkedItem}: HandleCheckboxClickProps) => void
    onChangeLabel: ({newLabel, todoId, itemId}: HandleChangeLabelProps) => void
    handlerChangeTodoTitle: (idTodo: number, newLabel: string) => void
}



export function Todo({
                         title,
                         items,
                         onDeleteTodoItem,
                         id,
                         onDeleteTodo,
                         onAddTodoItem,
                         onCheckboxClick,
                         onChangeLabel,
                         handlerChangeTodoTitle
                     }: TodoProps) {
    const [status, setStatus] = useState<TodoItemStatus|null>(null)
    const [inputText, setInputText] = useState<string>('')
    const [error, setError] = useState<string | null>(null)
    const filterItems = items.filter((el) => {
        if (status === TodoItemStatus.All || status === null) {
            return true;
        }
        return status === TodoItemStatus.Completed ? el.checked : !el.checked
    })
    const addTodoItem = (idItem: number) => {
        onDeleteTodoItem(id, idItem)
    }
    const changeLabelTodoItem = (newLabel: string, itemId: number) => {
        onChangeLabel({newLabel, todoId: id, itemId})
    }
    const onChangeTitleTodo = (newLabel: string) => {
        handlerChangeTodoTitle(id, newLabel)
    }
    const handleCheckboxClick = (idItem:number, checkedItem:boolean)=>{
        onCheckboxClick({idTodo:id,idItem,checkedItem})

}
    const MAX_COUNT_CHARS = 12
    const DO_NOT_USE_WORD = 'test'
    const KEY_COMBINATION_ENTER = 13


    useEffect(()=>{
        const statusStorage = localStorage.getItem('status')
        if (statusStorage===null){
            return
        }
        const objOfDataLS = JSON.parse(statusStorage)
        const statusFromLS = objOfDataLS[id]
        if (statusFromLS){
            setStatus(statusFromLS)
        }
        // const todo = arrayOfDataLS.find((todo:TodoProps)=>{
        //
        //    return todo.id===id
        // })array
        // if (todo){
        //     setStatus(todo.status)
        // }


    },[])

    useEffect(()=> {
        if (status ===null){
            return
        }
        const statusStorage = localStorage.getItem('status')

        if (statusStorage === null) {
            const newObjForTodo = {
            [id]:status
            }
          localStorage.setItem('status',JSON.stringify(newObjForTodo))
            return;
        }
        const objOfDataLS = JSON.parse(statusStorage)
             objOfDataLS[id]=status
            localStorage.setItem('status', JSON.stringify(objOfDataLS))






            // const todo = arrayOfDataLS.find((todo:TodoProps)=>{
            //     return todo.id===id
            // })
            // if (todo){
            //     if (status !== null) {
            //         const arrayLSWithActualStatuses = arrayOfDataLS.map((todoLS:any)=>{
            //             if (todoLS.id===id){
            //                 todoLS.status = status
            //                 return todoLS
            //             }
            //             return todoLS
            //         })
            //         localStorage.setItem('status', JSON.stringify(arrayLSWithActualStatuses))
            //     }
            //     return
            // }
            // const newObjForTodo = {
            //     id:id,
            //     status: actualStatusForLS
            // }
            // arrayOfDataLS.push(newObjForTodo)
            // localStorage.setItem('status',JSON.stringify(arrayOfDataLS))
        },[status])
    return (
        <div>
            <button onClick={() => {
                onDeleteTodo(id)
            }}>Delete
            </button>
            <div>
                <div className={styles.legend}>
                    <EditableLabel label={title} onChangeLabel={onChangeTitleTodo}/>
                </div>
                <div className={styles.search}>
                    <input value={inputText} onChange={(e) => {
                        if (e.target.value.length <= MAX_COUNT_CHARS && e.target.value !== DO_NOT_USE_WORD) {
                            setInputText(e.target.value);
                        }
                    }
                    }
                           className={error ? styles.error : ''}
                           onKeyPress={(e) => {
                               setError(null)
                               if (e.charCode === KEY_COMBINATION_ENTER) {
                                   onAddTodoItem(inputText, id)
                                   setInputText('')
                               }
                           }}
                    />
                    <button onClick={() => {
                        if (!inputText.trim()) {
                            return setError('Title is required')
                        }
                        onAddTodoItem(inputText, id);
                        setInputText('')
                    }}>+
                    </button>
                </div>
                {error && <div className={styles.errorMessage}>{error}</div>}
                {filterItems.map((item) => <TodoItem key={item.id} onChangeLabelItem={changeLabelTodoItem}
                                                     handleCheckboxClick={handleCheckboxClick} id={item.id}
                                                     onDelete={addTodoItem} label={item.label}
                                                     checked={item.checked}/>)}
                <button onClick={() => {
                    setStatus(TodoItemStatus.All)
                }} className={clsx(styles.button, {[styles.selectedButton]: status === TodoItemStatus.All || status=== null})}>All
                </button>
                <button onClick={() => {
                    setStatus(TodoItemStatus.Active)
                }} className={clsx(styles.button, {[styles.selectedButton]: status === TodoItemStatus.Active})}>Active
                </button>
                <button onClick={() => {
                    setStatus(TodoItemStatus.Completed)
                }} className={clsx(styles.button, {[styles.selectedButton]: status === TodoItemStatus.Completed})}>Completed
                </button>
            </div>
        </div>
    )
}
