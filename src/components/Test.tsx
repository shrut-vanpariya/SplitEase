<div className="md:hidden">
                            <Drawer>
                                <DrawerTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                                    Make Group
                                </DrawerTrigger>
                                <DrawerContent>
                                    <DrawerHeader>
                                        <DrawerTitle>New Group</DrawerTitle>
                                        <DrawerDescription>Fill out the form to create a new group.</DrawerDescription>
                                    </DrawerHeader>
                                    <div className="p-4 pb-0 space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="groupName">Group Name</Label>
                                            <Input
                                                id="groupName"
                                                value={groupName}
                                                onChange={(e) => setGroupName(e.target.value)}
                                                placeholder="Enter group name"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2 flex flex-col">
                                            <Label htmlFor="members">Members</Label>
                                            <div className="flex gap-5">
                                                <Combobox {...{ value, setValue, members, friendList }} />
                                                <Button
                                                    variant={"outline"}
                                                    onClick={handleAdd}
                                                    className="w-full"
                                                >
                                                    Add
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="max-h-96">
                                            {members.length > 0 && members.map((member: any, index: any) => {
                                                return <>
                                                    <div key={index} className="flex justify-between p-2">
                                                        <div>
                                                            {member.label}
                                                        </div>
                                                        <Button variant={"outline"} onClick={() => handleDel(member.value)}>
                                                            <Trash2 size={20} />
                                                        </Button>
                                                    </div>
                                                </>
                                            })}
                                        </div>
                                    </div>
                                    <DrawerFooter>
                                        {/* <Button>Submit</Button> */}
                                        <DrawerClose>
                                            <Button variant="outline">Cancel</Button>
                                        </DrawerClose>
                                    </DrawerFooter>
                                </DrawerContent>
                            </Drawer>
                        </div>