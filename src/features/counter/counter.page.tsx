import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Button } from '@mui/material';
import { RootState } from '../../app/store';
import { increment, decrement } from './counter.slice';


function Counter() {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <Box>
      <Typography variant="h4">Count: {count}</Typography>
      <Button onClick={() => dispatch(increment())}>Increment</Button>
      <Button onClick={() => dispatch(decrement())}>Decrement</Button>
    </Box>
  );
}

export default Counter;