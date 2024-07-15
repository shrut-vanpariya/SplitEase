import { create } from 'zustand'


export const useStore = create((set) => ({
    userData: null,
    setUserData: (userData: any) => set((state: any) => ({ userData: userData })),
    friendData: null,
    setFriendData: (friendData: any) => set((state: any) => ({ friendData: friendData })),
    groupData: null,
    setGroupData: (groupData: any) => set((state: any) => ({ groupData: groupData })),
    reloadData: false,
    setReloadData: (reloadData: any) => set((state: any) => ({reloadData: reloadData}))
}))