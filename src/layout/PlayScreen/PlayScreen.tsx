import Box from '@/components/Box';
import Control from '@/components/Control';
import GameBoard from '@/components/GameBoard';
import ScoreBoard from '@/components/ScoreBoard';
import useGameBoard from '@/hooks/useGameBoard';
import useGameScore from '@/hooks/useGameScore';
import useGameState, { GameStatus } from '@/hooks/useGameState';
import useLocalStorage from '@/hooks/useLocalStorage';
import useScaleControl from '@/hooks/useScaleControl';
import { ThemeName } from '@/themes/types';
import { GRID_SIZE, MIN_SCALE, SPACING } from '@/utils/constants';
import { canGameContinue, isWin } from '@/utils/rules';
import { FC, useCallback, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import useTheme from '@/hooks/useTheme';
import Text from '@/components/Text';
export type Configuration = {
  theme: ThemeName;
  bestScore: number;
  rows: number;
  cols: number;
};

const APP_NAME = 'react-2048';

const PlayScreen: FC = () => {
  const [gameState, setGameStatus] = useGameState({
    status: 'running',
    pause: false,
  });

  const [config, setConfig] = useLocalStorage<Configuration>(APP_NAME, {
    theme: 'default',
    bestScore: 0,
    rows: MIN_SCALE,
    cols: MIN_SCALE,
  });

  const [{ name: themeName, value: themeValue }] = useTheme(config.theme);

  const [rows, setRows] = useScaleControl(config.rows);
  const [cols, setCols] = useScaleControl(config.cols);

  const { total, best, addScore, setTotal } = useGameScore(config.bestScore);

  const { tiles, grid, onMove, onMovePending, onMergePending } = useGameBoard({
    rows,
    cols,
    gameState,
    addScore,
  });

  const onResetGame = useCallback(() => {
    setGameStatus('restart');
  }, [setGameStatus]);

  const onCloseNotification = useCallback(
    (currentStatus: GameStatus) => {
      setGameStatus(currentStatus === 'win' ? 'continue' : 'restart');
    },
    [setGameStatus],
  );

  if (gameState.status === 'restart') {
    setTotal(0);
    setGameStatus('running');
  } else if (gameState.status === 'running' && isWin(tiles)) {
    setGameStatus('win');
  } else if (gameState.status !== 'lost' && !canGameContinue(grid, tiles)) {
    setGameStatus('lost');
  }

  useEffect(() => {
    setGameStatus('restart');
  }, [rows, cols, setGameStatus]);

  useEffect(() => {
    setConfig({ rows, cols, bestScore: best, theme: themeName });
  }, [rows, cols, best, themeName, setConfig]);

  return (
    <ThemeProvider theme={themeValue}>
      <Box
        justifyContent="center"
        inlineSize="100%"
        blockSize="100%"
        alignItems="start"
        borderRadius={0}
      >
        <Box
          justifyContent="center"
          flexDirection="column"
          inlineSize={`${GRID_SIZE}px`}
        >
          {/* <Box marginBlockStart="s6" inlineSize="100%" justifyContent="end">
            <Switch
              title="dark mode"
              checked={themeName === 'dark'}
              activeValue="dark"
              inactiveValue="default"
              onChange={setTheme}
            />
          </Box> */}
          <Box
            inlineSize="100%"
            justifyContent="space-between"
            marginBlockStart="s2"
          >
            <Box>
              <Text fontSize={64} fontWeight="bold" color="primary">
                2048
              </Text>
            </Box>
            <Box justifyContent="center">
              <ScoreBoard total={total} title="score" />
              <ScoreBoard total={best} title="best" />
            </Box>
          </Box>
          <Box marginBlockStart="s2" marginBlockEnd="s6" inlineSize="100%">
            <Control
              rows={rows}
              cols={cols}
              onReset={onResetGame}
              onChangeRow={setRows}
              onChangeCol={setCols}
            />
          </Box>
          <GameBoard
            tiles={tiles}
            boardSize={GRID_SIZE}
            rows={rows}
            cols={cols}
            spacing={SPACING}
            gameStatus={gameState.status}
            onMove={onMove}
            onMovePending={onMovePending}
            onMergePending={onMergePending}
            onCloseNotification={onCloseNotification}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default PlayScreen;
