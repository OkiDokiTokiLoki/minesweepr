const $board = $('#board');
const ROWS = 10;
const COLS = 10;

function createBoard(rows, columns){
    $board.empty();
    for (let i=0; i < rows; i++){
        const $row = $('<div>').addClass('row');
        for (let j=0; j < columns; j++){
            const $col = $('<div>')
            .addClass('col hidden')
            .attr('data-row', i)
            .attr('data-col', j)
            if (Math.random() < 0.1){
                $col.addClass('mine');
            }
            $row.append($col);
        }
        $board.append($row);
    }
}

createBoard(10,10);

function restart(){
    createBoard(ROWS,COLS);
}

function gameOver(isWin){
    let message = null;
    let icon = null;
    if (isWin){
        message = "Nicely done, you win this round!";
        icon = 'fa fa-flag';
    } else{
        message = 'Oof! Better luck next time';
        icon = 'fa fa-bomb';
    }

    $('.col.mine').append(
        $('<i>').addClass(icon)
    );

    $('.col:not(.mine')
        .html(function(){
            const $cell = $(this);
            const count = getMineCount(
                $cell.data('row'),
                $cell.data('col'),
            );
            return count === 0 ? '' : count;
        })
    $('.col.hidden').removeClass('hidden')
    setTimeout(function(){
        alert(message);
        restart();
    }, 400);
}

function reveal(oi, oj){
    const seen = {};

    function helper(i, j){
        if (i >= ROWS || j >= COLS || i < 0 || j < 0) return;
        const key = `${i} ${j}`
        if (seen[key]) return;
        const $cell = 
            $(`.col.hidden[data-row=${i}][data-col=${j}]`);
        const mineCount = getMineCount(i, j);
        if (
            !$cell.hasClass('hidden') ||
            $cell.hasClass('mine')
        ){
            return;
        }

        $cell.removeClass('hidden');

        if (mineCount){
            $cell.text(mineCount);
            return;
        }

        for (let diri = -1; diri <= 1; diri++){
            for (let dirj = -1; dirj <= 1; dirj++){
                helper(i + diri, j + dirj);
            }
        }
    }

    helper(oi, oj);
}

function getMineCount(i, j){
    let count = 0;
    for (let diri = -1; diri <= 1; diri++){
        for (let dirj = -1; dirj <= 1; dirj++){
            const newi = i + diri;
            const newj = j + dirj;
            if (newi >= ROWS || newj >= COLS || newj < 0 || newi < 0) continue;
            const $cell = 
                $(`.col.hidden[data-row=${newi}][data-col=${newj}]`);
            if ($cell.hasClass('mine')) count ++;
        }
    }
    return count;
}

$board.on('click', '.col.hidden', function(){
    const $cell = $(this);
    const row = $cell.data('row');
    const col = $cell.data('col');
    if ($cell.hasClass('mine')){
        gameOver(false);
    } else{
        reveal(row, col);
        const isGameOver = $('.col.hidden').length === $('col.mine').length
        if (isGameOver) gameOver(true);
    }
})

restart();