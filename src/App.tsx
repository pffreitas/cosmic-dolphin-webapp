import React from 'react';
import { Provider } from 'react-redux';
import { Container, Typography } from '@mui/material';
import store from './app/store';
import Counter from './features/counter/counter.page';

function App() {
  return (
    <Provider store={store}>
      <Container maxWidth="md">
        <Typography>Cosmic Dolphin</Typography>
        <Counter />
      </Container>
    </Provider>
  );
}

export default App;
