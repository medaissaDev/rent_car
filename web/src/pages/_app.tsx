import type { AppProps } from 'next/app';
import { ChakraProvider, Container, Flex, Heading, HStack, Link as CLink, Spacer, Button, extendTheme } from '@chakra-ui/react';
import Link from 'next/link';

const theme = extendTheme({
	styles: { global: { body: { bg: 'gray.50' } } },
	colors: { brand: { 500: '#0ea5e9' } }
});

function Layout({ children }: { children: React.ReactNode }) {
	return (
		<Container maxW="7xl">
			<Flex py={4} align="center">
				<Heading size="md"><Link href="/">Car Rental TN</Link></Heading>
				<Spacer />
				<HStack spacing={4}>
					<CLink as={Link} href="/">Home</CLink>
					<CLink as={Link} href="/login">Login</CLink>
					<CLink as={Link} href="/register">Register</CLink>
				</HStack>
			</Flex>
			{children}
		</Container>
	);
}

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ChakraProvider theme={theme}>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</ChakraProvider>
	);
}