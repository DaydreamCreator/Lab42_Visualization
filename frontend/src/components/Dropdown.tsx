import { useState } from 'react';
import { Box, Button, Menu, MenuItem, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setFloor } from '../store/floorSlice';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const Dropdown = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dispatch = useDispatch();
  const currentFloor = useSelector((state: RootState) => state.floor.currentFloor);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFloorSelect = (floor: 'first' | 'fourth') => {
    dispatch(setFloor(floor));
    handleClose();
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, position: 'relative', right:500 }}>
      <Typography variant="h6">FLOOR: </Typography>
      <Button
        variant="contained"
        onClick={handleClick}
        sx={{ minWidth: '120px' }}
      >
        {currentFloor === 'first' ? 'First Floor' : 'Fourth Floor' }
        <ArrowDropDownIcon />
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: '#3E3F5B',
            color: 'white',
          },
        }}
      >
        <MenuItem onClick={() => handleFloorSelect('first')}>First Floor</MenuItem>
        <MenuItem onClick={() => handleFloorSelect('fourth')}>Fourth Floor</MenuItem>
      </Menu>
    </Box>
  );
};

export default Dropdown;