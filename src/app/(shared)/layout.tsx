import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <AdminPanelLayout>
                {children}
            </AdminPanelLayout>
        </>
    )
}