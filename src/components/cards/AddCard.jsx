import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import AddIcon from '@mui/icons-material/Add';

export default function AddCard({ title, onClick, icon = <AddIcon color="primary" />, }) {
    return (
        <Card
            sx={{
                border: 1,
                borderColor: 'primary.main',
                transition: '0.4s',

                '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: 4,
                    bgcolor: 'action.hover',
                },
                
            }}
        >
            <CardActionArea onClick={onClick}>
                <CardContent>
                    <Box
                        display="flex"
                        justifyContent="space-evenly"
                        alignItems="center"
                    >
                        {icon}

                        <Typography variant="h6">
                            {title}
                        </Typography>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}