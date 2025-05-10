import React, {useState, useEffect} from 'react';
import styles from './TableWithContextMenu.module.css';

interface MenuItem {
    label: string;
    action: () => void;
}

interface ContextMenuProps {
    x: number;
    y: number;
    onClose: () => void;
    menuItems: MenuItem[];
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
                        item.action();
                        onClose();
                    }}
                >
                    {item.label}
                </div>
            ))}
        </div>
    );
};


export const TableWithContextMenu: React.FC = () => {
    const [contextMenu, setContextMenu] = useState<{
        x: number;
        y: number;
        menuItems: MenuItem[];
    } | null>(null);

    const data = [
        [
            { value: 'A1', menuItems: [{ label: 'Edit A1', action: () => console.log('Edit A1') }] },
            { value: 'B1', menuItems: [{ label: 'Delete B1', action: () => console.log('Delete B1') }] },
            { value: 'C1', menuItems: [{ label: 'Copy C1', action: () => console.log('Copy C1') }] },
        ],
        [
            { value: 'A2', menuItems: [{ label: 'Edit A2', action: () => console.log('Edit A2') }] },
            { value: 'B2', menuItems: [{ label: 'Delete B2', action: () => console.log('Delete B2') }] },
            { value: 'C2', menuItems: [{ label: 'Copy C2', action: () => console.log('Copy C2') }] },
        ],
        [
            { value: 'A3', menuItems: [{ label: 'Edit A3', action: () => console.log('Edit A3') }] },
            { value: 'B3', menuItems: [{ label: 'Delete B3', action: () => console.log('Delete B3') }] },
            { value: 'C3', menuItems: [{ label: 'Copy C3', action: () => console.log('Copy C3') }] },
        ],
    ];

    const handleCellContextMenu = (e: React.MouseEvent, menuItems: MenuItem[]) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenu(null); // Close any existing context menu
        setTimeout(() => { // Delay to ensure the menu opens for the new cell
            setContextMenu({
                x: e.clientX,
                y: e.clientY,
                menuItems,
            });
        }, 0);
    };

    useEffect(() => {
        const handleClickOutside = () => setContextMenu(null);
        const handleScroll = () => setContextMenu(null);

        document.addEventListener('click', handleClickOutside);
        document.addEventListener('scroll', handleScroll);

        return () => {
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div style={{ position: 'relative' }}>
            <table className={styles.table}>
                <tbody>
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                            <td
                                key={cellIndex}
                                className={styles.cell}
                                onContextMenu={(e) => handleCellContextMenu(e, cell.menuItems)}
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
        </div>
    );
};
