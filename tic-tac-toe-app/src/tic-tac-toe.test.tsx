import Game from './tic-tac-toe';
import '@testing-library/jest-dom'
import {render, fireEvent, waitFor, screen} from '@testing-library/react'
import '@testing-library/jest-dom'

import { describe, it, expect } from '@jest/globals'


describe('Game', () => {
    test('', async ()=> {
        render(<Game />)
        screen.debug()
    })
})
