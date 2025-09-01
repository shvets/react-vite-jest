import React, {useState, useEffect} from 'react'

import styles from './TableWithContextMenu.module.css'

interface MenuItem {
    label: string
    action: () => void
}

interface Cell {
    value: string
    type: 'edit' | 'delete' | 'copy'
}

const generateMenuItems = (type: Cell['type'], value: string): MenuItem[] => {
    switch (type) {
        case 'edit':
            return [{ label: `Edit ${value}`, action: () => console.log(`Edit ${value}`) }]
        case 'delete':
            return [{ label: `Delete ${value}`, action: () => console.log(`Delete ${value}`) }]
        case 'copy':
            return [{ label: `Copy ${value}`, action: () => console.log(`Copy ${value}`) }]
        default:
            return []
    }
}

interface ContextMenuProps {
    x: number
    y: number
    onClose: () => void
    menuItems: MenuItem[]
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose, menuItems }) => {
    return (
        <div
            className={styles.contextMenu}
            style={{ position: 'absolute', top: y, left: x }}
            onClick={(e) => e.stopPropagation()}
        >
            {menuItems.map((item, index) => (
                <div
                    key={index}
                    className={styles.menuItem}
                    onClick={() => {
                        item.action()
                        onClose()
                    }}
                >
                    {item.label}
                </div>
            ))}
        </div>
    )
}

const useContextMenu = () => {
    const [contextMenu, setContextMenu] = useState<{
        x: number
        y: number
        menuItems: MenuItem[]
    } | null>(null)

    const handleCellContextMenu = (event: React.MouseEvent, menuItems: MenuItem[]) => {
        event.preventDefault()
        event.stopPropagation()

        closeMenu()

        setTimeout(() => { // Delay to ensure the menu opens for the new cell
            openMenu(menuItems, event)
        }, 0)
    }

    const openMenu = (menuItems: MenuItem[], event: React.MouseEvent) => {
        setContextMenu({
            x: event.clientX,
            y: event.clientY,
            menuItems,
        })
    }

    const closeMenu = () => {
        setContextMenu(null)
    }

    useEffect(() => {
        const handleClickOutside = () => setContextMenu(null)
        const handleScroll = () => setContextMenu(null)
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeMenu()
            }
        }

        document.addEventListener('click', handleClickOutside)
        document.addEventListener('scroll', handleScroll) // , true
        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('click', handleClickOutside)
            document.removeEventListener('scroll', handleScroll)
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    return {contextMenu, setContextMenu, handleCellContextMenu}
}


export const TableWithContextMenu: React.FC = () => {
    const { contextMenu, setContextMenu, handleCellContextMenu } = useContextMenu()

    const data: Cell[][] = [
        [
            { value: 'A1', type: 'edit' },
            { value: 'B1', type: 'delete' },
            { value: 'C1', type: 'copy' },
        ],
        [
            { value: 'A2', type: 'edit' },
            { value: 'B2', type: 'delete' },
            { value: 'C2', type: 'copy' },
        ],
        [
            { value: 'A3', type: 'edit' },
            { value: 'B3', type: 'delete' },
            { value: 'C3', type: 'copy' },
        ],
    ]

    return (
        <>
        {/*<div style={{ position: 'relative' }}>*/}
            <table className={styles.table}>
                <tbody>
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                            <td
                                key={cellIndex}
                                className={styles.cell}
                                onContextMenu={(e) =>
                                    handleCellContextMenu(e, generateMenuItems(cell.type, cell.value))
                                }
                            >
                                {cell.value}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    onClose={() => setContextMenu(null)}
                    menuItems={contextMenu.menuItems}
                />
            )}
        {/*</div>*/}
        </>
    )
}