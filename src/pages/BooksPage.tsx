import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator} from "@/components/ui/breadcrumb"
import { baseFileUrl, getBookList } from "@/http/api"
import { useQuery } from "@tanstack/react-query"
import { Badge } from "@/components/ui/badge"
import { Button} from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ListFilter, MoreHorizontal, PlusCircle , File} from "lucide-react"
import { Book } from "@/types"
import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import Modal from "@/components/PDFViewer/Modal"


const BooksPage = () => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [bookUrl,setBookUrl] = useState("");
  const [bookCount, setBookCount] = useState(0);

  const {data: BookList} = useQuery({
    queryKey: ['books'],
    queryFn: getBookList,
    staleTime: 10000, //in milliseconds
 });
 var items = Array.isArray(BookList?.data) ? BookList?.data : [];
  
 useEffect(() => {
  items = Array.isArray(BookList?.data) ? BookList?.data : [];
  console.log(items);
  setBookCount(items.length || 0);

	},[items])


  return (
    <>
    
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/home">Home</BreadcrumbLink>
               </BreadcrumbItem>
                 <BreadcrumbSeparator />
             <BreadcrumbItem>
           <BreadcrumbPage>Books</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
    
     <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 mt-6">
          <Tabs defaultValue="all">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="draft">Draft</TabsTrigger>
                <TabsTrigger value="archived" className="hidden sm:flex">
                  Archived
                </TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <ListFilter className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Filter
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked>
                      Active
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      Archived
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button size="sm" variant="outline" className="h-8 gap-1">
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Export
                  </span>
                </Button>

                <Link to={"/dashboard/books/create/0"}>
                <Button size="sm" className="h-8 gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Book
                  </span>
                </Button>
                </Link>
              </div>
            </div>
            <TabsContent value="all">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>Books</CardTitle>
                  <CardDescription>
                    Manage your Books and view their sales performance.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="hidden w-[100px] sm:table-cell">
                          <span className="sr-only">Image</span>
                        </TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Author name
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Created at
                        </TableHead>
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {
                        items.map((book:Book) => {
                          return  <TableRow key={book.book_id}>
                        <TableCell className="hidden sm:table-cell">
                          <img
                            alt={book.name}
                            className="aspect-square rounded-md object-cover"
                            height="64"
                            src={`${baseFileUrl}${book.coverImageUrl}`}
                            width="64"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {book.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{book.book_category_name}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {book.author_name}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {book.createdAt}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                aria-haspopup="true"
                                size="icon"
                                variant="ghost"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem title={book.name} onSelect={() => {
                                console.log("click edit");
                                navigate(`/dashboard/books/create/${book.book_id}`);
                              }}>Edit</DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => {
                                var src = `${baseFileUrl}${book.fileUrl}`;
                                setBookUrl(src);
                                setShowModal(!showModal);
                              }}>View</DropdownMenuItem>
                              <DropdownMenuItem>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                        })
                      }
                     
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                  <div className="text-xs text-muted-foreground">
                    Showing <strong>1-{bookCount < 10 ? bookCount : 10}</strong> of <strong>{bookCount}</strong>{" "}
                    products
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
          

        </main>
        
          {showModal ? <div id="textlayer"><Modal modalShow={showModal} modalClose={() => setShowModal(false)} url={bookUrl} /></div>: null}
        
    </>
  )
}

export default BooksPage