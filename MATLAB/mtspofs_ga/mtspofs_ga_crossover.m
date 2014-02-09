% MTSPOFS_GA Fixed Start Open Multiple Traveling Salesmen Problem (M-TSP) Genetic Algorithm (GA)
%   Finds a (near) optimal solution to a variation of the "open" M-TSP by
%   setting up a GA to search for the shortest route (least distance needed
%   for each salesman to travel from the start location to unique individual
%   cities without returning to the starting location)
%
% Summary:
%     1. Each salesman starts at the first point, but travels to a unique
%        set of cities after that (and none of them close their loops by
%        returning to their starting points)
%     2. Except for the first, each city is visited by exactly one salesman
%
% Note: The Fixed Start is taken to be the first XY point
%
% Input:
%     XY (float) is an Nx2 matrix of city locations, where N is the number of cities
%     DMAT (float) is an NxN matrix of city-to-city distances or costs
%     NSALESMEN (scalar integer) is the number of salesmen to visit the cities
%     MINTOUR (scalar integer) is the minimum tour length for any of the
%         salesmen, NOT including the start point
%     POPSIZE (scalar integer) is the size of the population (should be divisible by 8)
%     NUMITER (scalar integer) is the number of desired iterations for the algorithm to run
%     SHOWPROG (scalar logical) shows the GA progress if true
%     SHOWRESULT (scalar logical) shows the GA results if true
%
% Output:
%     OPTROUTE (integer array) is the best route found by the algorithm
%     OPTBREAK (integer array) is the list of route break points (these specify the indices
%         into the route used to obtain the individual salesman routes)
%     MINDIST (scalar float) is the total distance traveled by the salesmen
%
% Route/Breakpoint Details:
%     If there are 10 cities and 3 salesmen, a possible route/break
%     combination might be: rte = [5 6 9 4 2 8 10 3 7], brks = [3 7]
%     Taken together, these represent the solution [1 5 6 9][1 4 2 8 10][1 3 7],
%     which designates the routes for the 3 salesmen as follows:
%         . Salesman 1 travels from city 1 to 5 to 6 to 9
%         . Salesman 2 travels from city 1 to 4 to 2 to 8 to 10
%         . Salesman 3 travels from city 1 to 3 to 7
%
% Example:
%     n = 35;
%     xy = 10*rand(n,2);
%     nSalesmen = 5;
%     minTour = 3;
%     popSize = 80;
%     numIter = 5e3;
%     a = meshgrid(1:n);
%     dmat = reshape(sqrt(sum((xy(a,:)-xy(a',:)).^2,2)),n,n);
%     [optRoute,optBreak,minDist] = mtspofs_ga(xy,dmat,nSalesmen,minTour, popSize,numIter,1,1);
%
% Example:
%     n = 50;
%     phi = (sqrt(5)-1)/2;
%     theta = 2*pi*phi*(0:n-1);
%     rho = (1:n).^phi;
%     [x,y] = pol2cart(theta(:),rho(:));
%     xy = 10*([x y]-min([x;y]))/(max([x;y])-min([x;y]));
%     nSalesmen = 5;
%     minTour = 3;
%     popSize = 80;
%     numIter = 1e4;
%     a = meshgrid(1:n);
%     dmat = reshape(sqrt(sum((xy(a,:)-xy(a',:)).^2,2)),n,n);
%     [optRoute,optBreak,minDist] = mtspofs_ga(xy,dmat,nSalesmen,minTour, ...
%         popSize,numIter,1,1);
%
% Example:
%     n = 35;
%     xyz = 10*rand(n,3);
%     nSalesmen = 5;
%     minTour = 3;
%     popSize = 80;
%     numIter = 5e3;
%     a = meshgrid(1:n);
%     dmat = reshape(sqrt(sum((xyz(a,:)-xyz(a',:)).^2,2)),n,n);
%     [optRoute,optBreak,minDist] = mtspofs_ga(xyz,dmat,nSalesmen,minTour,popSize,numIter,1,1);
%
% See also: mtsp_ga, mtspf_ga, mtspo_ga, mtspof_ga, mtspv_ga, distmat
%
% Author: Joseph Kirk
% Email: jdkirk630@gmail.com
% Release: 1.4
% Release Date: 11/07/11
function varargout = mtspofs_ga_crossover(xy,dmat,nSalesmen,minTour,popSize,numIter,showProg,showResult)

% Process Inputs and Initialize Defaults
nargs = 8;
for k = nargin:nargs-1
    switch k
        case 0
            xy = 10*rand(40,2);
        case 1
            N = size(xy,1);
            a = meshgrid(1:N);
            dmat = reshape(sqrt(sum((xy(a,:)-xy(a',:)).^2,2)),N,N);
        case 2
            nSalesmen = 5;
        case 3
            minTour = 2;
        case 4
            popSize = 80;
        case 5
            numIter = 5e3;
        case 6
            showProg = 1;
        case 7
            showResult = 1;
        otherwise
    end
end

% Verify Inputs
[N,dims] = size(xy);
[nr,nc] = size(dmat);
if N ~= nr || N ~= nc
    error('Invalid XY or DMAT inputs!')
end
n = N - 1; % Separate Start City

% Sanity Checks
nSalesmen = max(1,min(n,round(real(nSalesmen(1)))));
minTour = max(1,min(floor(n/nSalesmen),round(real(minTour(1)))));
popSize = max(8,8*ceil(popSize(1)/8));
numIter = max(1,round(real(numIter(1))));
showProg = logical(showProg(1));
showResult = logical(showResult(1));

% Initializations for Route Break Point Selection
nBreaks = nSalesmen-1;
dof = n - minTour*nSalesmen;          % degrees of freedom
addto = ones(1,dof+1);
for k = 2:nBreaks
    addto = cumsum(addto);
end
cumProb = cumsum(addto)/sum(addto);

% Initialize the Populations - modified
popRoute = zeros(popSize,n);         % population of routes
popBreak = zeros(popSize,nBreaks);   % population of breaks
popRoute(1,:) = (1:n) + 1;
popBreak(1,:) = rand_breaks();

% use nearest neighbour algorithm for a quarter of the solutions

for k = 2:popSize
    popRoute(k,:) = randperm(n) + 1;
    popBreak(k,:) = rand_breaks();
end


% Select the Colors for the Plotted Routes
pclr = ~get(0,'DefaultAxesColor');
clr = [1 0 0; 0 0 1; 0.67 0 1; 0 1 0; 1 0.5 0];
if nSalesmen > 5
    clr = hsv(nSalesmen);
end

% Run the GA
globalMin = Inf;
offDist=0;
dOffDist=0;
totalDist = zeros(1,popSize);
distHistory = zeros(1,numIter);
tmpPopRoute = zeros(8,n);
tmpPopBreak = zeros(8,nBreaks);
newPopRoute = zeros(popSize,n);
newPopBreak = zeros(popSize,nBreaks);
if showProg
    pfig = figure('Name','MTSPOFS_GA | Current Best Solution','Numbertitle','off');
end
for iter = 1 : numIter
    % Evaluate Members of the Population
    for p = 1 : popSize
        pRoute = popRoute(p,:);
        pBreak = popBreak(p,:);
        totalDist(p) = tot_Dist(pRoute, pBreak,n,dmat,nSalesmen);
    end

    %display(dmat);
     % Fitness value
    for p=1:1:popSize
        cost     = totalDist(p);
        f_pRoute = popRoute(p,:);
        %display(f_pRoute);
        f_pBreak = popBreak(p,:);
        
        [fitVal(p), offDists(p), dOffDists(p)] = calced_fitVal(f_pBreak, f_pRoute, dmat, cost);      


    end
    
    %display(fitVal);
    % Find the Best Route in the Population
    
    [minFitVal,index] = min(fitVal);
    minDist = totalDist(index);
    
    %[minDist,index] = min(totalDist);
    %minFitVal = fitVal(index);
    
    offDistmin = offDists(index);
    dODistmin = dOffDists(index);
    %display(minDist);
    %display(minFitVal);
    
    distHistory(iter) = minFitVal;
    if minFitVal < globalMin
        globalMin = minFitVal;
        
        optRoute = popRoute(index,:);
        optBreak = popBreak(index,:);
        rng = [[1 optBreak+1];[optBreak n]]';
        if showProg
            % Plot the Best Route
            figure(pfig);
            for s = 1:nSalesmen
                rte = [1 optRoute(rng(s,1):rng(s,2))];
                if dims > 2, plot3(xy(rte,1),xy(rte,2),xy(rte,3),'.-','Color',clr(s,:));
                else plot(xy(rte,1),xy(rte,2),'.-','Color',clr(s,:)); end
                title(sprintf('Total Distance = %1.4f, Fitness Value = %1.4f, OffDist = %1.4f, dOffDist= %1.4f,  Iteration = %d',minDist,minFitVal,offDistmin,dODistmin,iter));
                hold on
            end
            if dims > 2, plot3(xy(1,1),xy(1,2),xy(1,3),'o','Color',pclr);
            else plot(xy(1,1),xy(1,2),'o','Color',pclr); end
            hold off
        end
    end
    
    
    % Genetic Algorithm Operators - modified
    randomOrder = randperm(popSize);
    for p = 24:24:popSize
        rtes = popRoute(randomOrder(p-23:p),:);
%         display(rtes);
        brks = popBreak(randomOrder(p-23:p),:);
%         display(brks);
        fitVals = fitVal(randomOrder(p-23:p));
%        dists = totalDist(randomOrder(p-7:p));
%         display(dists);
 
%        [ignore,idx] = min(fitVals); %#ok
%        [ignore,idx] = min(dists); %#ok
        

%%%%%%%%%corssover%%%%%%%%%%%%%%

%        bestOf8Route = rtes(idx,:);
%        bestOf8Break = brks(idx,:);
        routeInsertionPoints = sort(ceil(n*rand(1,2)));
        I = routeInsertionPoints(1);
        J = routeInsertionPoints(2);
        
        
        [sFitVals, IX] = sort(fitVals);
        par1_route = rtes(IX(1),:);
        par1_brks = brks(IX(1),:);
        par2_route = rtes(IX(2),:);
        par2_brks = brks(IX(2),:);
        ch1_route = par1_route;
        ch1_brks = par1_brks;
        %removing the duplicate elements
        for i=I:1:J
            ch1_route(find(ch1_route==(par2_route(i)))) = [];
        end
        
        permchild1 = [ch1_route,par2_route(I:J)];
        old_cost = tot_Dist(permchild1, ch1_brks,n,dmat,nSalesmen);
        [old_fitVal, old_offDist, old_dOffDist] = calced_fitVal(ch1_brks, permchild1, dmat, old_cost);
        
        %find the best possible location to insert the new part
        for i=2:n-(J-I)-2
            perm1= [ch1_route(1:i),par2_route(I:J),ch1_route(i+1:length(ch1_route))];
            cost = tot_Dist(perm1, ch1_brks,n,dmat,nSalesmen);
            [nfitVal, noffDist, ndOffDist] = calced_fitVal(ch1_brks, perm1, dmat, cost);
            if(nfitVal<old_fitVal)
                permchild1=perm1;
                old_fitVal = fitVal;
            end
        end
        ch2_route = par2_route;
        ch2_brks = par2_brks;
        %removing the duplicate elements
        for i=I:1:J
            ch2_route(find(ch2_route==(par1_route(i)))) = [];
        end
        %permchild2 = [ch2_route,par1_route(I:J)];
        
        
        permchild2 = [ch1_route,par2_route(I:J)];
        old_cost = tot_Dist(permchild2, ch2_brks,n,dmat,nSalesmen);
        [old_fitVal, old_offDist, old_dOffDist] = calced_fitVal(ch2_brks, permchild2, dmat, old_cost);
        
        %find the best possible location to insert the new part
        for i=2:n-(J-I)-2
            perm2= [ch2_route(1:i),par1_route(I:J),ch2_route(i+1:length(ch2_route))];
            cost = tot_Dist(perm1, ch1_brks,n,dmat,nSalesmen);
            [nfitVal, noffDist, ndOffDist] = calced_fitVal(ch2_brks, perm2, dmat, cost);
            if(nfitVal<old_fitVal)
                permchild2=perm2;
                old_fitVal = fitVal;
            end
        end

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%



        for k = 1:24 % Generate New Solutions
            switch k
                case 1 % Best solution
                    tmpPopRoute(k,:) = par1_route;
                    tmpPopBreak(k,:) = par1_brks;
                case 2 % Flip
                    tmpPopRoute(k,:) = par1_route;
                    tmpPopBreak(k,:) = par1_brks;
                    tmpPopRoute(k,I:J) = tmpPopRoute(k,J:-1:I);
                case 3 % Swap
                    tmpPopRoute(k,:) = par1_route;
                    tmpPopBreak(k,:) = par1_brks;                    
                    tmpPopRoute(k,[I J]) = tmpPopRoute(k,[J I]);
                case 4 % Slide
                    tmpPopRoute(k,:) = par1_route;
                    tmpPopBreak(k,:) = par1_brks;                    
                    tmpPopRoute(k,I:J) = tmpPopRoute(k,[I+1:J I]);
                case 5 % Modify Breaks
                    tmpPopRoute(k,:) = par1_route;
                    tmpPopBreak(k,:) = rand_breaks();
                case 6 % Flip, Modify Breaks
                    tmpPopRoute(k,:) = par1_route;                
                    tmpPopRoute(k,I:J) = tmpPopRoute(k,J:-1:I);
                    tmpPopBreak(k,:) = rand_breaks();
                case 7 % Swap, Modify Breaks
                    tmpPopRoute(k,:) = par1_route;
                    tmpPopRoute(k,[I J]) = tmpPopRoute(k,[J I]);
                    tmpPopBreak(k,:) = rand_breaks();
                case 8 % Second child
                     tmpPopRoute(k,:) = permchild2;
                     tmpPopBreak(k,:) = ch2_brks;
                case 9 % Second best solution
                      tmpPopRoute(k,:) = par2_route;
                      tmpPopBreak(k,:) = par2_brks;
                case 10 % First Child
                      tmpPopRoute(k,:) = permchild1;
                      tmpPopBreak(k,:) = ch1_brks;
                case 11 % First Child, random breaks
                      tmpPopRoute(k,:) = permchild1;
                      tmpPopBreak(k,:) = rand_breaks();
                case 12 % Seond Child, random breaks
                      tmpPopRoute(k,:) = permchild2;
                      tmpPopBreak(k,:) = rand_breaks();
                case 13 % Second best, Swap
                      tmpPopRoute(k,:) = par2_route;
                      tmpPopRoute(k,[I J]) = tmpPopRoute(k,[J I]);
                      tmpPopBreak(k,:) = par2_brks;
                case 14 % Second best, Flip
                      tmpPopRoute(k,:) = par2_route;
                      tmpPopRoute(k,I:J) = tmpPopRoute(k,J:-1:I);
                      tmpPopBreak(k,:) = par2_brks;
                case 15 % First Child, Swap
                      tmpPopRoute(k,:) = permchild1;
                      tmpPopRoute(k,[I J]) = tmpPopRoute(k,[J I]);
                      tmpPopBreak(k,:) = ch1_brks;
                case 16 % First Child, Flip
                      tmpPopRoute(k,:) = permchild1;
                      tmpPopRoute(k,I:J) = tmpPopRoute(k,J:-1:I);
                      tmpPopBreak(k,:) = ch1_brks;
                case 17 % First Child, Slide
                      tmpPopRoute(k,:) = permchild1;
                      tmpPopRoute(k,I:J) = tmpPopRoute(k,[I+1:J I]);
                      tmpPopBreak(k,:) = ch1_brks;
                case 18 % Second best, Slide 
                      tmpPopRoute(k,:) = par2_route;
                      tmpPopRoute(k,I:J) = tmpPopRoute(k,[I+1:J I]);
                      tmpPopBreak(k,:) = par2_brks;
                case 19 % Second Child, Swap
                      tmpPopRoute(k,:) = permchild2;
                      tmpPopRoute(k,[I J]) = tmpPopRoute(k,[J I]);
                      tmpPopBreak(k,:) = ch2_brks;
                case 20 % Seond Child, Flip
                      tmpPopRoute(k,:) = permchild2;
                      tmpPopRoute(k,I:J) = tmpPopRoute(k,J:-1:I);
                      tmpPopBreak(k,:) = ch2_brks;
                case 21 % Seond Child, Slide
                      tmpPopRoute(k,:) = permchild2;
                      tmpPopRoute(k,I:J) = tmpPopRoute(k,[I+1:J I]);
                      tmpPopBreak(k,:) = ch2_brks;
                case 22 % Second best, Flip, modify breaks
                      tmpPopRoute(k,:) = par2_route;
                      tmpPopRoute(k,I:J) = tmpPopRoute(k,J:-1:I);
                      tmpPopBreak(k,:) = rand_breaks();
                case 23 % Second best, Swap, modify breaks
                      tmpPopRoute(k,:) = par2_route;
                      tmpPopRoute(k,[I J]) = tmpPopRoute(k,[J I]);
                      tmpPopBreak(k,:) = rand_breaks();
                case 24 % First Child, Flip, modify breaks
                      tmpPopRoute(k,:) = permchild1;
                      tmpPopRoute(k,I:J) = tmpPopRoute(k,J:-1:I);
                      tmpPopBreak(k,:) = rand_breaks();
                otherwise % Do Nothing
            end
        end
        newPopRoute(p-23:p,:) = tmpPopRoute;
        newPopBreak(p-23:p,:) = tmpPopBreak;
    end
    popRoute = newPopRoute;
    popBreak = newPopBreak;
end

if showResult
% Plots
    figure('Name','MTSPOFS_GA | Results','Numbertitle','off');
    subplot(2,2,1);
    if dims > 2, plot3(xy(:,1),xy(:,2),xy(:,3),'.','Color',pclr);
    else plot(xy(:,1),xy(:,2),'.','Color',pclr); end
    title('Store Locations');
    subplot(2,2,2);
    imagesc(dmat([1 optRoute],[1 optRoute]));
    title('Distance Matrix');
    subplot(2,2,3);
    rng = [[1 optBreak+1];[optBreak n]]';
    for s = 1:nSalesmen
        rte = [1 optRoute(rng(s,1):rng(s,2))];
        if dims > 2, plot3(xy(rte,1),xy(rte,2),xy(rte,3),'.-','Color',clr(s,:));
        else plot(xy(rte,1),xy(rte,2),'.-','Color',clr(s,:)); end
        title(sprintf('Total Distance = %1.4f Fitness Value = %1.4f',minDist, minFitVal));
        hold on;
    end
    if dims > 2, plot3(xy(1,1),xy(1,2),xy(1,3),'o','Color',pclr);
    else plot(xy(1,1),xy(1,2),'o','Color',pclr); end
    subplot(2,2,4);
    plot(distHistory,'b','LineWidth',2);
    title('Best Solution History');
    set(gca,'XLim',[0 numIter+1],'YLim',[0 1.1*max([1 distHistory])]);
end

% Return Outputs
if nargout
    varargout{1} = optRoute;
    varargout{2} = optBreak;
    varargout{3} = minFitVal;
end

    % Generate Random Set of Break Points
    function breaks = rand_breaks()
        if minTour == 1 % No Constraints on Breaks
            tmpBreaks = randperm(n-1);
            breaks = sort(tmpBreaks(1:nBreaks));
        else % Force Breaks to be at Least the Minimum Tour Length
            nAdjust = find(rand < cumProb,1)-1;
            spaces = ceil(nBreaks*rand(1,nAdjust));
            adjust = zeros(1,nBreaks);
            for kk = 1:nBreaks
                adjust(kk) = sum(spaces == kk);
            end
            breaks = minTour*(1:nBreaks) + cumsum(adjust);
        end
    end
end


    %fitness Value function
    function [fitVal, offDist, dOffDist] = calced_fitVal(f_pBreak, f_pRoute, dmat, cost)
        satrt_brk_idx  = 1;
        offDist=0;
        offRout = 4;
        offRoutLim = 0.5;
            for i = 1 : 1 : length(f_pBreak) + 1 
                if i == (length(f_pBreak) + 1)
                    end_brk_idx = length(f_pRoute) - 1;
                else
                    end_brk_idx = f_pBreak(i) - 1;
                end
                %display(end_brk_idx);
                %display(satrt_brk_idx);
                %%%for each route in the solution
                %R is direct distance to the destination for that route
                R = dmat(1, f_pRoute(end_brk_idx + 1));
                %display(R);
                % depo to the first store in the route
                totDist = dmat(1, f_pRoute(satrt_brk_idx));
                for j = satrt_brk_idx : 1 : end_brk_idx                
                      totDist = totDist + dmat(f_pRoute(j), f_pRoute(j + 1));
                end
                satrt_brk_idx = end_brk_idx + 2;
                %display(totDist);
                if (totDist - R)<0
                    msgbox('Negative off distance', 'Error','error');
                    break
                end
                if ((totDist - R) > offRoutLim)
                    offDist = offDist + (totDist - R) - offRoutLim;
                    dOffDist= offDist + (totDist - R);
                %    display(offDist);
                end
            end 
        fitVal = cost + offRout*offDist;
    end


    function d = tot_Dist(pRoute, pBreak,n,dmat,nSalesmen)
        d      = 0;
        rng    = [[1 pBreak + 1];[pBreak n]]';
        for s = 1:nSalesmen
                d = d + dmat(1,pRoute(rng(s,1))); % Add Start Distance
                for k = rng(s, 1) : rng(s, 2) - 1
                    d = d + dmat(pRoute(k), pRoute(k + 1));
                end
        end
    end