import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

export default function ClassroomSearchCard({ sala, selected, onToggle, onEdit, onDelete }) {
    return (
        <Card
            sx={{
                border: 1,
                borderColor: sala.disponivel
                    ? 'success.main'
                    : 'error.main',
                transition: '0.4s',
                '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: 4,
                },
            }}
        >
            <CardActionArea onClick={onToggle}>
                <CardContent>
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Typography variant="h6">
                            {sala.sala_nome}
                        </Typography>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}