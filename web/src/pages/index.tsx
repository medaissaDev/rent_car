import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import { API_BASE_URL, toImageUrl } from '../lib/config';
import { Box, Button, Container, Flex, FormControl, FormLabel, Heading, Image, Input, SimpleGrid, Stack, Text, Switch, HStack, Select } from '@chakra-ui/react';

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
	requiresCaution?: string;
}

export default function HomePage({ cars, q, location, minPrice, maxPrice, requiresCaution }: Props) {
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
					<SimpleGrid columns={{ base: 1, md: 6 }} gap={4}>
						<FormControl><FormLabel>Search</FormLabel><Input name="q" placeholder="Brand, model" defaultValue={q} /></FormControl>
						<FormControl><FormLabel>Location</FormLabel><Input name="location" placeholder="Location" defaultValue={location} /></FormControl>
						<FormControl><FormLabel>Min TND</FormLabel><Input name="minPrice" type="number" placeholder="Min TND" defaultValue={minPrice} /></FormControl>
						<FormControl><FormLabel>Max TND</FormLabel><Input name="maxPrice" type="number" placeholder="Max TND" defaultValue={maxPrice} /></FormControl>
						<FormControl display="flex" alignItems="center">
							<FormLabel mb="0">Requires caution</FormLabel>
							<Switch name="requiresCaution" defaultChecked={requiresCaution === 'true'} value="true" />
						</FormControl>
						<FormControl alignSelf="flex-end"><Button type="submit" colorScheme="teal" w="full">Search</Button></FormControl>
					</SimpleGrid>
				</form>
				<SimpleGrid mt={6} columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
					{cars.map((c) => (
						<Box key={c._id} borderWidth="1px" borderRadius="md" overflow="hidden" bg="white" boxShadow="sm" _hover={{ boxShadow: 'md' }}>
							{c.images?.[0] && <Image alt="car" src={toImageUrl(c.images[0])} w="100%" h="200px" objectFit="cover" />}
							<Box p={4}>
								<Heading size="md">{c.brand} {c.model} · {c.year}</Heading>
								<Text color="gray.600">{c.location}</Text>
								<Text fontWeight="bold" mt={1}>{c.pricePerDayTnd} TND/day</Text>
								{c.requiresCaution && <Text color="orange.500">Caution: {c.cautionAmountTnd} TND</Text>}
								<Stack direction="row" mt={3}>
									<Button as={Link} href={`/cars/${c._id}`} colorScheme="teal" w="full">Details</Button>
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
	const { q = '', location = '', minPrice = '', maxPrice = '', requiresCaution = '' } = ctx.query as Record<string, string>;
	const params: any = { q, location, minPrice, maxPrice };
	if (requiresCaution) params.requiresCaution = requiresCaution;
	const { data } = await axios.get(`${API_BASE_URL}/api/cars`, { params });
	return { props: { cars: data.cars, q, location, minPrice, maxPrice, requiresCaution } };
};