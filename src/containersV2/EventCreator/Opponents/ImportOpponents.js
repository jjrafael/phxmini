import React from 'react';
import MultiSelectList from "phxNewComponents/MultiSelectList/MultiSelectList";


export default (props) => {
    let {
        className,
        opponents,
        marketId,
        updatedOpponents,
        selectedOpponents,
        onOpponentImport,
        onClose,
    } = props;
    let initialCheckedList = [];
    let selections = [];
    let list = opponents.map( (opponent, i) => {
        initialCheckedList.push(i);
        selections.push({
            opponentId: opponent.id,
            description: opponent.description,
            raceCardNumber: 0,
            marketId,
        });
        return opponent.description;
    });
    let hasOpponents = list.length ? true : false;
    return (
        <div className="rank-import-opponents">
            {hasOpponents && [
                <MultiSelectList
                    listTitle='Select all opponents'
                    listItems={list}
                    initialCheckedItems={initialCheckedList}
                    onSelectionChange={selectionMap => {
                        selections = [];
                        Object.keys(selectionMap).map((key, i) => {
                            if (selectionMap[key]) {
                                let opponent = opponents[Number(key)];
                                selections.push({
                                    opponentId: opponent.id,
                                    description: opponent.description,
                                    marketId,
                                });
                            }
                        });
                    }}
                />,
                <div className="modal-controls">
                    <button disabled={!hasOpponents} onClick={e => {
                        let previousSelections = [];
                        let updatedSelectionsIds = updatedOpponents.map(opponent => opponent.opponentId);
                        let newSelections = selections.filter(opponent => !updatedSelectionsIds.includes(opponent.opponentId));
                        let reselectedSelections = selections.filter(opponent => updatedSelectionsIds.includes(opponent.opponentId));
                        let filterSelectionsIds = [
                            ...selectedOpponents.map(opponent => opponent.opponentId),
                            ...newSelections.map(opponent => opponent.opponentId),
                            ...reselectedSelections.map(opponent => opponent.opponentId)
                        ]
                        previousSelections = updatedOpponents.filter(opponent => filterSelectionsIds.includes(opponent.opponentId));
                        let result = [
                            ...previousSelections,
                            ...newSelections
                        ]
                        onOpponentImport(result);
                        onClose();
                    }}>Import</button>
                </div>
            ]}
            {!hasOpponents &&
                <p style={{textAlign: 'center'}}>No available opponents.</p>
            }
        </div>
    );
}