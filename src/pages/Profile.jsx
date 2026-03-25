import Button from "@mui/material/Button";
import Container from "@mui/material/Container";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/hooks/useAuth";

export default function Profile() {
    const { logout } = useAuth()
    const navigate = useNavigate();

    const logoutNavigate = () => {
        logout()
        navigate("/")
    }

    const goBack = () => {
        navigate(-1)
    }

    return (
        <Container>
            <Button onClick={goBack}>
                Voltar
            </Button>
            <Button onClick={logoutNavigate}>
                Sair
            </Button>
        </Container>
    )
}