import Box from "@mui/material/Box"

import KeyCheckoutModal from "../components/modal/KeyCheckoutModal"

export default function KeyCheckout() {
    const retiradas = []
    return (
        <Box>
            <KeyCheckoutModal />

            {retiradas.map((retirada) => (
                <></>
            ))}
        </Box>
    )
}