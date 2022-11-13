import { signIn } from "next-auth/react";
import React from "react";
import { Button } from "../components/Button";
import { GoogleIcon } from "../components/Icon";
import { Stack } from "../components/Stack";
import { Paragraph, Text } from "../components/Typography";

const Auth = () => {
    const onClick = React.useCallback(() => {
        signIn('google', { callbackUrl: '/' });
    }, []);

    return (
        <Stack
            style={{
                height: '100vh',
                padding: 24,
            }}
            direction="column"
            alignItems="center"
            justifyContent="center"
            gap={24}
        >
            <Stack direction="column" gap={8}>
                <Text align="center" bold size="large" block>Zapis</Text>
                <Paragraph align="center" size="default">Log in to your account</Paragraph>
            </Stack>
            <Button
                onClick={onClick}
                icon={<GoogleIcon />}
                fullWidth
            >
                Sign in with Google
            </Button>
        </Stack>
    );
}

export default Auth;

