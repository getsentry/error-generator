import React from 'react';
// import { Box, Container, Heading, Text, VStack, Link } from '@chakra-ui/react';
// import ErrorGenerator from './ErrorGenerator';
import { Button } from '@/app/components/button';
import { Input } from '@/app/components/input';

export default function Page() {
  return (
    <>
      <Button>Click me</Button>
      <Button disabled>Click me</Button>
      <div style={{ margin: '16px 0', maxWidth: '300px' }}>
        <Input placeholder="Placeholder" />
        <Input disabled placeholder="Disabled" />
        <Input type="number" placeholder="1" />
        <Input disabled type="number" placeholder="Disabled" />
      </div>

      {/* <Box
        minHeight="100vh"
        bg="background.dark"
        color="white"
        display="flex"
        flexDirection="column"
      >
        <Container maxW="container.md" py={10} flex="1">
          <VStack spacing={8} align="stretch">
            <Heading as="h1" size="2xl" textAlign="center">
              Sentry Error Generator
            </Heading>
            <ErrorGenerator />
          </VStack>
        </Container>

        <Box as="footer" py={6} mt="auto" textAlign="center">
          <Text fontSize="sm" color="gray.500">
            Commit{' '}
            <Link
              href={`https://github.com/getsentry/error-generator/commit/${process.env.COMMIT_HASH}`}
              isExternal
              color="gray.300"
              _hover={{ color: 'gray.200', textDecoration: 'underline' }}
              fontFamily="mono"
            >
              {process.env.COMMIT_HASH || 'unknown'}
            </Link>
          </Text>
        </Box>
      </Box> */}
    </>
  );
}
