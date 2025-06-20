'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    Button,
    Input,
    VStack,
    HStack,
    useToast,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Box,
    Tag,
    TagLabel,
    TagCloseButton,
    Flex,
    IconButton,
    Divider,
    Select,
    Switch,
    Text,
    Progress,
} from '@chakra-ui/react';
import { FaPlus } from 'react-icons/fa6';

interface CustomTag {
    key: string;
    value: string;
}

type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

const ErrorGenerator = () => {
    const [dsn, setDsn] = useState('');
    const [errorCount, setErrorCount] = useState('1');
    const [errorsToGenerate, setErrorsToGenerate] = useState('1');
    const [fingerprintID, setFingerprintID] = useState('');
    const [priority, setPriority] = useState<Priority>('HIGH');
    const [tags, setTags] = useState<CustomTag[]>([]);
    const [newTagKey, setNewTagKey] = useState('');
    const [newTagValue, setNewTagValue] = useState('');
    const [message, setMessage] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [dsnError, setDsnError] = useState('');

    // Interval mode states
    const [intervalMode, setIntervalMode] = useState(false);
    const [intervalFrequency, setIntervalFrequency] = useState('30');
    const [repeatCount, setRepeatCount] = useState('5');
    const [isIntervalRunning, setIsIntervalRunning] = useState(false);
    const [currentRepeat, setCurrentRepeat] = useState(0);
    const [totalRepeats, setTotalRepeats] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [isWaiting, setIsWaiting] = useState(false);

    // YOLO mode state
    const [yoloMode, setYoloMode] = useState(false);

    const cancelRef = useRef<HTMLButtonElement>(null);
    const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
    const countdownIdRef = useRef<NodeJS.Timeout | null>(null);
    const toast = useToast();

    // Cleanup intervals on unmount
    useEffect(() => {
        return () => {
            if (intervalIdRef.current) {
                clearTimeout(intervalIdRef.current);
            }
            if (countdownIdRef.current) {
                clearInterval(countdownIdRef.current);
            }
        };
    }, []);

    const validateDsn = (value: string): boolean => {
        if (!value) {
            setDsnError('DSN is required');
            return false;
        }
        const dsnRegex =
            /^https:\/\/[a-zA-Z0-9]+@([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+\/[0-9]+$/;
        if (!dsnRegex.test(value)) {
            setDsnError('Invalid DSN format');
            return false;
        }
        setDsnError('');
        return true;
    };

    const handleDsnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setDsn(value);
        validateDsn(value);
    };

    const addTag = () => {
        if (!newTagKey.trim() || !newTagValue.trim()) {
            toast({
                title: 'Invalid tag',
                description: 'Both key and value are required for tags',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        // Check if key already exists
        if (tags.some((tag) => tag.key === newTagKey.trim())) {
            toast({
                title: 'Duplicate tag key',
                description: 'A tag with this key already exists',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setTags([...tags, { key: newTagKey.trim(), value: newTagValue.trim() }]);
        setNewTagKey('');
        setNewTagValue('');
    };

    const removeTag = (keyToRemove: string) => {
        setTags(tags.filter((tag) => tag.key !== keyToRemove));
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const startCountdown = (duration: number): Promise<void> => {
        return new Promise((resolve) => {
            setTimeRemaining(duration);
            setIsWaiting(true);

            countdownIdRef.current = setInterval(() => {
                setTimeRemaining((prev) => {
                    if (prev <= 1) {
                        if (countdownIdRef.current) {
                            clearInterval(countdownIdRef.current);
                            countdownIdRef.current = null;
                        }
                        setIsWaiting(false);
                        resolve();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        });
    };

    const sendSingleErrorBatch = async () => {
        const eventsPerError = parseInt(errorCount, 10);
        const numErrors = fingerprintID ? 1 : parseInt(errorsToGenerate, 10);

        const response = await fetch('/api/generate-errors', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                dsn,
                errorCount: eventsPerError,
                errorsToGenerate: numErrors,
                fingerprintID,
                priority,
                tags: tags.reduce((acc, tag) => ({ ...acc, [tag.key]: tag.value }), {}),
                message,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to generate errors');
        }

        return data;
    };

    const executeInterval = async (repeats: number, frequency: number) => {
        setIsIntervalRunning(true);
        setCurrentRepeat(0);
        setTotalRepeats(repeats);

        for (let i = 0; i < repeats; i++) {
            try {
                setCurrentRepeat(i + 1);
                const data = await sendSingleErrorBatch();

                // Show toast for each interval execution
                const eventsPerError = parseInt(errorCount, 10);
                const numErrors = fingerprintID ? 1 : parseInt(errorsToGenerate, 10);

                toast({
                    title: `Batch ${i + 1} of ${repeats} sent`,
                    description:
                        data.message ||
                        `${numErrors} errors with ${eventsPerError} events each sent to Sentry`,
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                });

                if (i < repeats - 1) {
                    // Don't wait after the last iteration
                    await startCountdown(frequency);
                }
            } catch (error) {
                setIsIntervalRunning(false);
                setIsWaiting(false);
                throw error;
            }
        }

        setIsIntervalRunning(false);
        setIsWaiting(false);
        toast({
            title: 'Interval complete',
            description: `Successfully sent ${repeats} error batches`,
            status: 'success',
            duration: 5000,
            isClosable: true,
        });
    };

    const generateErrors = async () => {
        if (!validateDsn(dsn)) return;

        const eventsPerError = parseInt(errorCount, 10);
        const numErrors = fingerprintID ? 1 : parseInt(errorsToGenerate, 10);

        if (isNaN(eventsPerError) || eventsPerError <= 0) {
            toast({
                title: 'Invalid event count',
                description: 'Please enter a positive number for events per error',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        if (!fingerprintID && (isNaN(numErrors) || numErrors <= 0)) {
            toast({
                title: 'Invalid error count',
                description: 'Please enter a positive number for number of errors',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        // Validate interval mode inputs
        if (intervalMode) {
            const frequency = parseInt(intervalFrequency, 10);
            const repeats = parseInt(repeatCount, 10);

            if (isNaN(frequency) || frequency <= 0) {
                toast({
                    title: 'Invalid interval frequency',
                    description: 'Please enter a positive number for interval frequency',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
                return;
            }

            if (isNaN(repeats) || repeats <= 0) {
                toast({
                    title: 'Invalid repeat count',
                    description: 'Please enter a positive number for repeat count',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
                return;
            }
        }

        setIsLoading(true);

        try {
            if (intervalMode) {
                const frequency = parseInt(intervalFrequency, 10);
                const repeats = parseInt(repeatCount, 10);
                await executeInterval(repeats, frequency);
            } else {
                const data = await sendSingleErrorBatch();
                toast({
                    title: 'Errors sent',
                    description:
                        data.message ||
                        `${numErrors} errors with ${eventsPerError} events each have been sent to Sentry`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to generate errors',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
            setIsIntervalRunning(false);
            setIsWaiting(false);
        }
    };

    const stopInterval = () => {
        if (intervalIdRef.current) {
            clearTimeout(intervalIdRef.current);
            intervalIdRef.current = null;
        }
        if (countdownIdRef.current) {
            clearInterval(countdownIdRef.current);
            countdownIdRef.current = null;
        }
        setIsIntervalRunning(false);
        setIsWaiting(false);
        setIsLoading(false);
        toast({
            title: 'Interval stopped',
            description: `Stopped after ${currentRepeat} of ${totalRepeats} iterations`,
            status: 'warning',
            duration: 3000,
            isClosable: true,
        });
    };

    const onClose = () => setIsOpen(false);
    const onConfirm = () => {
        onClose();
        generateErrors();
    };

    const getButtonText = () => {
        if (isIntervalRunning) {
            return `Running (${currentRepeat}/${totalRepeats})`;
        }
        if (isLoading) {
            return intervalMode ? 'Starting...' : 'Generating...';
        }
        return intervalMode ? 'Start Interval' : 'Generate Errors';
    };

    const handleGenerateClick = () => {
        if (yoloMode) {
            generateErrors();
        } else {
            setIsOpen(true);
        }
    };

    return (
        <VStack spacing={4} align="stretch">
            <FormControl>
                <HStack justifyContent="flex-end">
                    <Switch
                        id="yolo-mode"
                        isChecked={yoloMode}
                        onChange={(e) => setYoloMode(e.target.checked)}
                        colorScheme="red"
                    />
                    <FormLabel htmlFor="yolo-mode" mb={0}>
                        YOLO Mode
                    </FormLabel>
                </HStack>
            </FormControl>
            <FormControl isInvalid={!!dsnError}>
                <FormLabel>Sentry DSN</FormLabel>
                <Input placeholder="Enter your Sentry DSN" value={dsn} onChange={handleDsnChange} />
                <FormErrorMessage>{dsnError}</FormErrorMessage>
            </FormControl>
            <FormControl>
                <FormLabel>Priority</FormLabel>
                <Select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                </Select>
            </FormControl>
            <FormControl>
                <FormLabel>Custom Message (Optional)</FormLabel>
                <Input
                    placeholder="Enter a custom error message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
            </FormControl>
            <FormControl>
                <FormLabel>Fingerprint (Optional)</FormLabel>
                <Input
                    placeholder="Enter a fingerprint to group errors"
                    value={fingerprintID}
                    onChange={(e) => setFingerprintID(e.target.value)}
                />
            </FormControl>
            <FormControl>
                <FormLabel>Number of Events per Error</FormLabel>
                <NumberInput min={1} value={errorCount} onChange={(value) => setErrorCount(value)}>
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </FormControl>
            {!fingerprintID && (
                <FormControl>
                    <FormLabel>Number of Errors to Generate</FormLabel>
                    <NumberInput
                        min={1}
                        value={errorsToGenerate}
                        onChange={(value) => setErrorsToGenerate(value)}
                    >
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </FormControl>
            )}

            <Divider />

            <FormControl>
                <HStack>
                    <Switch
                        id="interval-mode"
                        isChecked={intervalMode}
                        onChange={(e) => setIntervalMode(e.target.checked)}
                        colorScheme="brand"
                    />
                    <FormLabel htmlFor="interval-mode" mb={0}>
                        Enable Batch Mode
                    </FormLabel>
                </HStack>
                {intervalMode && (
                    <Text fontSize="sm" color="white" mt={1}>
                        Send the same error configuration multiple times at regular intervals
                    </Text>
                )}
            </FormControl>

            {intervalMode && (
                <VStack spacing={3} align="stretch">
                    <HStack spacing={4}>
                        <FormControl flex={1}>
                            <FormLabel>Interval (seconds)</FormLabel>
                            <NumberInput
                                min={1}
                                value={intervalFrequency}
                                onChange={(value) => setIntervalFrequency(value)}
                            >
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </FormControl>
                        <FormControl flex={1}>
                            <FormLabel>Number of Repeats</FormLabel>
                            <NumberInput
                                min={1}
                                value={repeatCount}
                                onChange={(value) => setRepeatCount(value)}
                            >
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </FormControl>
                    </HStack>

                    {isIntervalRunning && (
                        <Box>
                            <HStack justifyContent="space-between" mb={2}>
                                <Text fontSize="sm">
                                    Progress: {currentRepeat} of {totalRepeats} completed
                                </Text>
                                {isWaiting && (
                                    <Text fontSize="sm" color="orange.500" fontWeight="medium">
                                        Next in: {formatTime(timeRemaining)}
                                    </Text>
                                )}
                            </HStack>
                            <Progress
                                value={(currentRepeat / totalRepeats) * 100}
                                colorScheme="brand"
                                size="sm"
                            />
                            {isWaiting && (
                                <Progress
                                    value={
                                        ((parseInt(intervalFrequency, 10) - timeRemaining) /
                                            parseInt(intervalFrequency, 10)) *
                                        100
                                    }
                                    colorScheme="orange"
                                    size="xs"
                                    mt={1}
                                />
                            )}
                        </Box>
                    )}
                </VStack>
            )}

            <Divider />

            <FormControl>
                <FormLabel>Custom Tags (Optional)</FormLabel>
                <VStack align="stretch" spacing={3}>
                    <HStack>
                        <Input
                            placeholder="Tag key"
                            value={newTagKey}
                            onChange={(e) => setNewTagKey(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    addTag();
                                }
                            }}
                            flex={1}
                        />
                        <Input
                            placeholder="Tag value"
                            value={newTagValue}
                            onChange={(e) => setNewTagValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    addTag();
                                }
                            }}
                            flex={1}
                        />
                        <IconButton
                            aria-label="Add tag"
                            icon={<FaPlus />}
                            onClick={addTag}
                            colorScheme="green"
                            size="md"
                        />
                    </HStack>

                    {tags.length > 0 && (
                        <Flex wrap="wrap" gap={2}>
                            {tags.map((tag) => (
                                <Tag key={tag.key} size="md" variant="solid" colorScheme="brand">
                                    <TagLabel>
                                        {tag.key}: {tag.value}
                                    </TagLabel>
                                    <TagCloseButton onClick={() => removeTag(tag.key)} />
                                </Tag>
                            ))}
                        </Flex>
                    )}
                </VStack>
            </FormControl>

            <HStack justifyContent="flex-end" spacing={3}>
                {isIntervalRunning && (
                    <Button onClick={stopInterval} colorScheme="red" variant="outline" size="md">
                        Stop Interval
                    </Button>
                )}
                <Button
                    onClick={handleGenerateClick}
                    colorScheme="brand"
                    width="auto"
                    isLoading={isLoading || isIntervalRunning}
                    loadingText={getButtonText()}
                    isDisabled={isIntervalRunning}
                >
                    {getButtonText()}
                </Button>
            </HStack>

            <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            {intervalMode ? 'Start Interval Mode' : 'Generate Errors'}
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            {intervalMode ? (
                                <>
                                    Warning: This will generate errors every {intervalFrequency}{' '}
                                    seconds, repeated {repeatCount} times. This action will generate
                                    real errors and use up your Sentry quota significantly. This may
                                    result in substantial additional costs depending on your Sentry
                                    plan. Are you sure you want to proceed?
                                </>
                            ) : (
                                <>
                                    Warning: This action will generate real errors and use up your
                                    Sentry quota. This may result in additional costs depending on
                                    your Sentry plan. Are you sure you want to proceed?
                                </>
                            )}
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button
                                colorScheme="red"
                                onClick={onConfirm}
                                ml={3}
                                isLoading={isLoading}
                            >
                                {intervalMode ? 'Start Interval' : 'Generate Errors'}
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </VStack>
    );
};

export default ErrorGenerator;
