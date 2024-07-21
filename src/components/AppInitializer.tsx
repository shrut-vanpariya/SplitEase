'use client'

import { useStore } from "@/lib/globalStore";
import { useSession } from "next-auth/react";
import { useEffect } from "react";


export default function AppInitializer({ children }: any) {

    const { data: session, status } = useSession();
    const {
        userData,
        setUserData,
        friendData,
        setFriendData,
        groupData,
        setGroupData,
        reloadData,
        setReloadData
    }: any = useStore();

    useEffect(() => {
        // console.log('fetch user data');

        if (status === 'authenticated' && (!userData || reloadData)) {

            try {
                fetch(`/api/user?email=${session?.user?.email}`)
                    .then(response => response.json())
                    .then(data => {
                        // Handle the data (e.g., update state or perform other actions)
                        // console.log('User data:', data);
                        setUserData(data.user);
                    })
                    .catch(error => {
                        console.error('Error fetching user data:', error);
                    });
            } catch (error: any) {
                console.log(error.message);
            }
        }
    }, [session?.user?.email, setUserData, userData, status, reloadData])


    useEffect(() => {
        // console.log('fetch friend and group');

        if (userData) {
            if (!friendData || reloadData) {
                try {
                    fetch(`/api/friend?uid=${userData._id}`)
                        .then(response => response.json())
                        .then(data => {
                            // Handle the data (e.g., update state or perform other actions)
                            // console.log('Friend data:', data);
                            setFriendData(data);
                        })
                        .catch(error => {
                            console.error('Error fetching friend data:', error);
                        });
                } catch (error: any) {
                    console.error('Error fetching friend data:', error.message);
                }
            }

            if (!groupData || reloadData) {
                try {
                    fetch(`/api/group?uid=${userData._id}`)
                        .then(response => response.json())
                        .then(data => {
                            // Handle the data (e.g., update state or perform other actions)
                            // console.log('Group data:', data);
                            setGroupData(data);
                        })
                        .catch(error => {
                            console.error('Error fetching group data:', error);
                        });
                } catch (error: any) {
                    console.error('Error fetching group data:', error.message);
                }
            }
        }
    }, [friendData, groupData, reloadData, setFriendData, setGroupData, userData])

    useEffect(() => {
        if (reloadData) {
            console.log('window is reloaded');
            setReloadData(false)
        }
    }, [reloadData, setReloadData])

    useEffect(() => {
        const timer = setInterval(() => {
            setReloadData(true)
        }, 1000 * 10); // 1000ms = 1 seconds

        // Cleanup function to clear the timer if the component unmounts
        return () => clearTimeout(timer);
    }, []);

    return children;
}