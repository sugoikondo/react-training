import Game from './tic-tac-toe';
import '@testing-library/jest-dom'
import {render, fireEvent, waitFor, screen} from '@testing-library/react'
import '@testing-library/jest-dom'

import { describe, it, expect } from '@jest/globals'


describe('Game', () => {
    // 最初のユーザがマスをクリックした際、内部に "X" が入っていること
    test('When first user click square, then "X" if filled in square', async ()=> {
        render(<Game />)
        const firstSquareElm = document.querySelector('.game-board > div > div:nth-child(1) > button:nth-child(1)')

        fireEvent.click(firstSquareElm)
        expect(firstSquareElm).toHaveTextContent('X')
    })

    // 2回目のユーザがマスをクリックした際、内部に "O" が入っていること
    test('When second user click square, then "O" if filled in square', async ()=> {
        render(<Game />)
        const firstSquareElm = document.querySelector('.game-board > div > div:nth-child(1) > button:nth-child(1)')
        const secondSquareElm = document.querySelector('.game-board > div > div:nth-child(1) > button:nth-child(2)')

        fireEvent.click(firstSquareElm)
        fireEvent.click(secondSquareElm)
        expect(secondSquareElm).toHaveTextContent('O')
    })

    // 横一列が揃った場合、勝者を表示すること
    test('When horizontal line is filled, then display winner', async ()=> {
        render(<Game />)
        // Buttons that winner clicks
        const winnerButton1 = document.querySelector('.game-board > div > div:nth-child(1) > button:nth-child(1)')
        const winnerButton2 = document.querySelector('.game-board > div > div:nth-child(1) > button:nth-child(2)')
        const winnerButton3 = document.querySelector('.game-board > div > div:nth-child(1) > button:nth-child(3)')

        // Loser clicks
        const loserButton1 = document.querySelector('.game-board > div > div:nth-child(2) > button:nth-child(1)')
        const loserButton2 = document.querySelector('.game-board > div > div:nth-child(2) > button:nth-child(2)')

        // Click buttons in turns
        fireEvent.click(winnerButton1)
        fireEvent.click(loserButton1)
        fireEvent.click(winnerButton2)
        fireEvent.click(loserButton2)
        fireEvent.click(winnerButton3)

        // then check winner is displayed
        expect(screen.getByText('Winner: X')).toBeInTheDocument()
    })

    // 縦一列が揃った場合、勝者を表示すること
    test('When vertical line is filled, then display winner', async ()=> {
        render(<Game />)
        // Buttons that winner clicks
        const winnerButton1 = document.querySelector('.game-board > div > div:nth-child(1) > button:nth-child(1)')
        const winnerButton2 = document.querySelector('.game-board > div > div:nth-child(2) > button:nth-child(1)')
        const winnerButton3 = document.querySelector('.game-board > div > div:nth-child(3) > button:nth-child(1)')

        // Loser clicks
        const loserButton1 = document.querySelector('.game-board > div > div:nth-child(1) > button:nth-child(2)')
        const loserButton2 = document.querySelector('.game-board > div > div:nth-child(2) > button:nth-child(2)')

        // Click buttons in turns
        fireEvent.click(winnerButton1)
        fireEvent.click(loserButton1)
        fireEvent.click(winnerButton2)
        fireEvent.click(loserButton2)
        fireEvent.click(winnerButton3)
        await waitFor(() => screen.getByText('Winner: X'))

        // then check winner is displayed
        expect(screen.getByText('Winner: X')).toBeInTheDocument()
    })

    // 'Go to game start' をクリックしたら初期状態に戻っていること
    test('When click "Go to game start" button, then return to initial state', async ()=> {
        render(<Game />)
        // Clicks first square
        const firstSquareElm = document.querySelector('.game-board > div > div:nth-child(1) > button:nth-child(1)')
        fireEvent.click(firstSquareElm)
        expect(firstSquareElm).toHaveTextContent('X')

        // Then clicks "Go to game start" button
        fireEvent.click(screen.getByText('Go to game start'))
        expect(firstSquareElm).toHaveTextContent('')
    })
})
