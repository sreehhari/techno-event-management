import { useState, useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Box,
  Text,
  Button,
  Flex,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useMediaQuery,
} from '@chakra-ui/react';
import Link from 'next/link';
import { MdOutlineEvent } from 'react-icons/md';
import { PiCertificate } from 'react-icons/pi';
import { MdOutlineEmail } from 'react-icons/md';
import { MdOutlineSettings } from 'react-icons/md';
import { Router, useRouter } from 'next/router';
import EventsDisplay from './EventsDisplay';
import { account } from '../contexts/MyContext';

const Sidebar = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth0();
  const [isMobile] = useMediaQuery('(max-width: 768px)');

  const router = useRouter();
  const { orgId } = router.query;

  const handleLogout = (e) => {
    e.preventDefault();
    setLoading(true);
    logout({
      logoutParams: {
        returnTo: process.env.NEXT_PUBLIC_AUTH0_REDIRECT_URI,
      },
    });
  };

  return (
    <>
      {!isMobile ? (
        <Box
          padding={4}
          height="100%"
          minWidth={50}
          width={80}
          display="flex"
          flexDirection="column"
        >
          <Box paddingY={4}>
            <Text fontSize="4xl" fontWeight="bold">
              Event Sync
            </Text>
          </Box>

          <EventsDisplay />
          <SidebarContents />

          <Box flex="1"></Box>
          <Button
            onClick={() => {
              router.push(`/${orgId}/settings`);
            }}
            isLoading={loading}
            width="100%"
          >
            Organization Settings
          </Button>
          <Box paddingY={4}>
            <Button
              onClick={handleLogout}
              isLoading={loading}
              loadingText="Please Wait"
              width="100%"
            >
              Logout
            </Button>
          </Box>
        </Box>
      ) : (
        <>
          <Drawer isOpen={isOpen} onClose={onClose} placement="left">
            <DrawerOverlay>
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>
                  <Text fontSize="2xl" fontWeight="bold">
                    Event Sync
                  </Text>
                </DrawerHeader>
                <DrawerBody>
                  <EventsDisplay />
                  <SidebarContents />

                  <Box flex="1"></Box>
                  <Button
                    onClick={() => {
                      router.push(`/${orgId}/settings`);
                    }}
                    isLoading={loading}
                    width="100%"
                  >
                    Organization Settings
                  </Button>
                  <Box paddingY={4}>
                    <Button
                      onClick={handleLogout}
                      isLoading={loading}
                      loadingText="Please Wait"
                      width="100%"
                    >
                      Logout
                    </Button>
                  </Box>
                </DrawerBody>
              </DrawerContent>
            </DrawerOverlay>
          </Drawer>
        </>
      )}
    </>
  );
};

const SidebarContents = () => {
  const router = useRouter();
  const { orgId } = router.query;

  const { accountDetails } = useContext(account);
  const isUser = accountDetails.role === 'USER';

  const sidebarItems = [
    // { label: 'Events', path: `/${orgId}/events`, icon: <MdOutlineEvent /> },
    { label: 'My Certificates', path: `/${orgId}/mycertificates`, icon: <PiCertificate /> },
    { label: 'Email Settings', path: `/${orgId}/emailsettings`, icon: <MdOutlineEmail /> },
    ...(isUser ? [{ label: 'Settings', path: `/settings`, icon: <MdOutlineSettings /> }] : []),
  ];

  return (
    <>
      <Box>
        {/* Map over the sidebarItems array to generate sidebar items */}
        {sidebarItems.map((item, index) => (
          <Box
            key={index}
            _hover={{ color: 'black.400', backgroundColor: 'gray.100', cursor: 'pointer' }}
            onClick={() => {
              router.push(item.path);
            }}
            transition="outline 0.2s"
            borderRadius="md"
            padding="2"
            display="flex"
            flexDirection="row"
            alignItems="center"
          >
            <Box mr={2}>{item.icon}</Box>
            <Text fontSize="lg">{item.label}</Text>
          </Box>
        ))}
      </Box>
    </>
  );
};

export default Sidebar;
