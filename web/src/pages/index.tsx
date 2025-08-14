import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import { API_BASE_URL, toImageUrl } from '../lib/config';
import { Box, Button, Container, Flex, FormControl, Heading, Image, Input, SimpleGrid, Stack, Text } from '@chakra-ui/react';

interface Car {
	_id: string;
	brand: string;
	model: string;
	year: number;
	location: string;
	pricePerDayTnd: number;
	requiresCaution: boolean;
	cautionAmountTnd: number;
	images: string[];
}

interface Props {
	cars: Car[];
	q?: string;
	location?: string;
	minPrice?: string;
	maxPrice?: string;
}

export default function HomePage({ cars, q, location, minPrice, maxPrice }: Props) {
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		itemListElement: cars.map((c, i) => ({ '@type': 'ListItem', position: i + 1, url: `/cars/${c._id}`, name: `${c.brand} ${c.model} ${c.year}` }))
	};
	return (
		<>
			<Head>
				<title>Car Rental Tunisia | Rent cars by day in TND</title>
				<meta name="description" content="Search and rent cars from companies across Tunisia. Pay cash or card with Paymee. Prices in TND." />
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			</Head>
			<Container maxW="6xl" py={8}>
				<Heading mb={4}>Find your car</Heading>
				<form method="get">
					<Flex gap={3} wrap="wrap">
						<FormControl maxW="xs"><Input name="q" placeholder="Brand, model" defaultValue={q} /></FormControl>
						<FormControl maxW="xs"><Input name="location" placeholder="Location" defaultValue={location} /></FormControl>
						<FormControl maxW="xs"><Input name="minPrice" type="number" placeholder="Min TND" defaultValue={minPrice} /></FormControl>
						<FormControl maxW="xs"><Input name="maxPrice" type="number" placeholder="Max TND" defaultValue={maxPrice} /></FormControl>
						<Button type="submit" colorScheme="teal">Search</Button>
					</Flex>
				</form>
				<SimpleGrid mt={6} columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
					{cars.map((c) => (
						<Box key={c._id} borderWidth="1px" borderRadius="md" overflow="hidden">
							{c.images?.[0] && <Image alt="car" src={toImageUrl(c.images[0])} w="100%" h="200px" objectFit="cover" />}
							<Box p={3}>
								<Heading size="md">{c.brand} {c.model} · {c.year}</Heading>
								<Text>{c.location}</Text>
								<Text fontWeight="bold">{c.pricePerDayTnd} TND/day</Text>
								{c.requiresCaution && <Text color="orange.500">Caution: {c.cautionAmountTnd} TND</Text>}
								<Stack direction="row" mt={2}>
									<Button as={Link} href={`/cars/${c._id}`} colorScheme="teal">Details</Button>
								</Stack>
							</Box>
						</Box>
					))}
				</SimpleGrid>
			</Container>
		</>
	);
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
	const { q = '', location = '', minPrice = '', maxPrice = '' } = ctx.query as Record<string, string>;
	const { data } = await axios.get(`${API_BASE_URL}/api/cars`, { params: { q, location, minPrice, maxPrice } });
	return { props: { cars: data.cars, q, location, minPrice, maxPrice } };
};