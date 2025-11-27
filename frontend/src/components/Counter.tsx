import { Button, Typography, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { increment, decrement } from '../store/counterSlice';

const Counter = () => {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        计数器: {count}
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="contained"
          onClick={() => dispatch(increment())}
        >
          增加
        </Button>
        <Button
          variant="contained"
          onClick={() => dispatch(decrement())}
        >
          减少
        </Button>
      </Box>
    </Box>
  );
};

export default Counter; 