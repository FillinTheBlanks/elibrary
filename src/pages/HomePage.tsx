import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from 'react'
import useLoginStore from '@/storage'


const HomePage = () => {
    const [levelName,setLevelName] = useState("");
    const logFullname = useLoginStore((state) => state.fullname);
    const logLevel = useLoginStore((state) => state.level);
    useEffect(() => {
        switch(logLevel)
        {
            case "2":
                return setLevelName("ADMIN");
            default:
                return undefined;
        }
    },[])
    
  return (
    <>
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                <div className="flex min-h-screen w-full flex-col">
                    <main className="flex flex-1 flex-col gap-4 md:gap-6">
                        <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
                            <Card x-chunk="dashboard-01-chunk-0">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Welcome {logFullname}
                                    </CardTitle>
                                    
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{levelName}</div>
                                    
                                </CardContent>
                                </Card>
                        </div>
                    </main>
                </div>
            </main>

      </>
  )
}

export default HomePage