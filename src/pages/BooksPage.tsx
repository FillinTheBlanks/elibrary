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

  const [showPDFModal, setShowPDFModal] = useState<boolean>(false);
  const [bookUrl,setBookUrl] = useState("");
  const [bookCount, setBookCount] = useState(0);
  const [bookStatus, setBookStatus] = useState('ALL');
  const {data: BookList} = useQuery({
    queryKey: ['books', bookStatus],
    queryFn: () => getBookList(bookStatus!),
    //enabled: !!bookStatus && bookStatus !== '0',
    staleTime: 10000, //in milliseconds
    refetchInterval: 10000,
 });
 var items = Array.isArray(BookList?.data) ? BookList?.data : [];
  
 useEffect(() => {
  items = Array.isArray(BookList?.data) ? BookList?.data : [];
  console.log(items.length);
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
          <Tabs defaultValue="ALL" onValueChange={(value) => setBookStatus(value)}>
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="ALL">All</TabsTrigger>
                <TabsTrigger value="ACTIVE">Active</TabsTrigger>
                <TabsTrigger value="DRAFT">Draft</TabsTrigger>
                <TabsTrigger value="ARCHIVED" className="hidden sm:flex">
                  Archived
                </TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                <DropdownMenu >
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
                    <DropdownMenuCheckboxItem checked={bookStatus === 'ACTIVE'} onCheckedChange={(checked) => setBookStatus(checked ? 'ACTIVE' : 'ALL')}>
                      Active
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked={bookStatus === 'DRAFT'} onCheckedChange={(checked) => setBookStatus(checked ? 'DRAFT' : 'ALL')}>Draft</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked={bookStatus === 'ARCHIVED'} onCheckedChange={(checked) => setBookStatus(checked ? 'ARCHIVED' : 'ALL')}>
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
            <TabsContent value="ALL">
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
                        items.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                              No results.
                            </TableCell>
                          </TableRow>
                        ) :
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
                                navigate(`/dashboard/books/create/${book.book_id}`);
                              }}>Edit</DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => {
                                var src = `${baseFileUrl}${book.fileUrl}`;
                                setBookUrl(src);
                                setShowPDFModal(!showPDFModal);
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

            <TabsContent value="ACTIVE">
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
                        items.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                              No results.
                            </TableCell>
                          </TableRow>
                        ) :
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
                                setShowPDFModal(!showPDFModal);
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

            <TabsContent value="DRAFT">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>Books</CardTitle>
                  <CardDescription>
                    Drafted Books.
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
                        items.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                              No results.
                            </TableCell>
                          </TableRow>
                        ) :
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
                                setShowPDFModal(!showPDFModal);
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

            <TabsContent value="ARCHIVED">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>Books</CardTitle>
                  <CardDescription>
                    Archived Books.
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
                        items.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                              No results.
                            </TableCell>
                          </TableRow>
                        ) :
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
                                setShowPDFModal(!showPDFModal);
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
                    Showing <strong>1-{bookCount}</strong>{" "}
                    books
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
          

        </main>
        
          {showPDFModal ? <div id="textlayer"><Modal modalShow={showPDFModal} modalClose={() => setShowPDFModal(false)} url={bookUrl} /></div>: null}
        
    </>
  )
}

export default BooksPage